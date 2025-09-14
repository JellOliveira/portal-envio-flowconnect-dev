// 1. Importar as ferramentas
require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const path = require("path");

// 2. Configurações
const app = express();
const PORT = 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const N8N_WEBHOOK_URL_CAMPANHA = process.env.N8N_WEBHOOK_URL_CAMPANHA;

// 3. Inicializar os clientes
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 4. Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// --- LÓGICA DE AUTENTICAÇÃO E PERMISSÕES ---

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            // Se a rota for uma API, retorna erro JSON. Se não, redireciona.
            if (req.path.startsWith("/api/")) return res.status(401).json({ message: "Não autorizado." });
            return res.redirect("/login.html");
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            if (req.path.startsWith("/api/")) return res.status(401).json({ message: "Não autorizado." });
            return res.redirect("/login.html");
        }
        
        req.user = user;
        next();
    } catch (e) {
        if (req.path.startsWith("/api/")) return res.status(500).json({ message: "Erro interno do servidor." });
        return res.redirect("/login.html");
    }
};

const masterMiddleware = async (req, res, next) => {
    try {
        const { data: perfil, error } = await supabase.from("perfis").select("papel").eq("id", req.user.id).single();
        if (error || !perfil || perfil.papel !== "mestre") {
            return res.status(403).json({ message: "Acesso negado. Apenas administradores." });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: "Erro ao verificar permissões." });
    }
};

function validarDataHoraBrasil(dataEnvio) {
    const agora = new Date();
    const dataEnvioDate = new Date(dataEnvio);
    if (isNaN(dataEnvioDate.getTime())) {
        throw new Error("Data e hora inválidas.");
    }
    const margemMinima = new Date(agora.getTime() - (5 * 60000)); // Permite uma margem de 5 minutos no passado
    if (dataEnvioDate < margemMinima) {
        throw new Error("A data e hora do agendamento estão muito no passado.");
    }
    return true;
}

// --- ROTAS DE PÁGINAS E AUTENTICAÇÃO ---

app.get("/", authMiddleware, async (req, res) => {
    try {
        const { data: perfil, error } = await supabase.from("perfis").select("email, papel").eq("id", req.user.id).single();
        if (error || !perfil) {
            return res.redirect("/logout.html"); 
        }
        res.render("index", { 
            user: {
                email: perfil.email,
                displayName: perfil.email.split("@")[0],
                papel: perfil.papel
            }
        });
    } catch (error) {
        return res.redirect("/login.html");
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ message: "Email ou senha inválidos." });

    res.cookie("access_token", data.session.access_token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    res.cookie("refresh_token", data.session.refresh_token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    res.json({ message: "Login bem-sucedido!"});
});

app.post("/logout", (req, res) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json({ message: "Logout bem-sucedido!"});
});

app.get("/logout.html", (req, res) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.redirect("/login.html");
});

app.get("/admin", authMiddleware, masterMiddleware, async (req, res) => {
    try {
        const { data: perfil, error } = await supabase.from("perfis").select("email, papel").eq("id", req.user.id).single();
        if (error || !perfil) {
            return res.redirect("/logout.html"); 
        }
        res.render("admin", { 
            user: {
                email: perfil.email,
                displayName: perfil.email.split("@")[0],
                papel: perfil.papel
            }
        });
    } catch (error) {
        return res.redirect("/login.html");
    }
});

// --- ROTAS DE API (ADMIN) ---

app.get("/api/users", authMiddleware, masterMiddleware, async (req, res) => {
    const { data: perfis, error } = await supabase.from("perfis").select("*");
    if (error) {
        return res.status(500).json({ message: "Erro ao buscar usuários: " + error.message });
    }
    res.json(perfis || []);
});

app.post("/api/invite-user", authMiddleware, masterMiddleware, async (req, res) => {
    const { email, papel } = req.body;
    try {
        const { data: { user }, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email);
        if (inviteError) throw inviteError;

        const { error: profileError } = await supabase.from("perfis").insert({ id: user.id, email: user.email, papel: papel || "cliente"});
        if (profileError) throw profileError;

        res.status(200).json({ message: `Convite enviado com sucesso para ${email}!` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete("/api/users/:id", authMiddleware, masterMiddleware, async (req, res) => {
    const userIdToDelete = req.params.id;
    if (userIdToDelete === req.user.id) {
        return res.status(400).json({ message: "Você não pode excluir a si mesmo." });
    }
    try {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userIdToDelete);
        if (deleteError) throw deleteError;
        res.status(200).json({ message: "Usuário excluído com sucesso!"});
    } catch (error) {
        res.status(500).json({ message: `Falha ao excluir usuário: ${error.message}` });
    }
});

// --- ROTAS DO DASHBOARD SLA ---

app.get("/api/dashboard/stats", authMiddleware, masterMiddleware, async (req, res) => {
    try {
        // Buscar estatísticas do banco de dados
        const { data: campanhas, error: campanhasError } = await supabase
            .from("campanhas")
            .select("*")
            .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

        const { data: agendamentos, error: agendamentosError } = await supabase
            .from("agendamentos")
            .select("*")
            .eq("status", "pendente");

        const { data: usuarios, error: usuariosError } = await supabase
            .from("perfis")
            .select("*");

        if (campanhasError || agendamentosError || usuariosError) {
            throw new Error("Erro ao buscar estatísticas");
        }

        res.json({
            totalVisits: Math.floor(Math.random() * 1000) + 100, // Simulado - implementar analytics real
            activeUsers: usuarios ? usuarios.length : 0,
            campaignsSent: campanhas ? campanhas.length : 0,
            messagesScheduled: agendamentos ? agendamentos.length : 0
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar estatísticas: " + error.message });
    }
});

app.get("/api/dashboard/activities", authMiddleware, masterMiddleware, async (req, res) => {
    try {
        // Buscar atividades recentes do banco de dados
        const { data: campanhas, error: campanhasError } = await supabase
            .from("campanhas")
            .select("nome_campanha, created_at, user_id")
            .order("created_at", { ascending: false })
            .limit(10);

        const { data: agendamentos, error: agendamentosError } = await supabase
            .from("agendamentos")
            .select("copy_mensagem, created_at, user_id")
            .order("created_at", { ascending: false })
            .limit(10);

        if (campanhasError || agendamentosError) {
            throw new Error("Erro ao buscar atividades");
        }

        const activities = [];
        
        if (campanhas) {
            campanhas.forEach(campanha => {
                activities.push({
                    action: `Campanha "${campanha.nome_campanha}" enviada`,
                    time: formatTimeAgo(campanha.created_at),
                    type: "campanha"
                });
            });
        }

        if (agendamentos) {
            agendamentos.forEach(agendamento => {
                activities.push({
                    action: "Mensagem agendada",
                    time: formatTimeAgo(agendamento.created_at),
                    type: "agendamento"
                });
            });
        }

        // Ordenar por data mais recente
        activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.json(activities.slice(0, 10));
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar atividades: " + error.message });
    }
});

app.get("/api/dashboard/popular-pages", authMiddleware, masterMiddleware, async (req, res) => {
    try {
        // Dados simulados de páginas populares - implementar analytics real
        const popularPages = [
            { page: "/", visits: Math.floor(Math.random() * 500) + 200 },
            { page: "/admin", visits: Math.floor(Math.random() * 200) + 50 },
            { page: "/login.html", visits: Math.floor(Math.random() * 150) + 30 }
        ];

        res.json(popularPages);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar páginas populares: " + error.message });
    }
});

// Função auxiliar para formatar tempo
function formatTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Agora mesmo";
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hora${diffInHours > 1 ? "s" : ""} atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} dia${diffInDays > 1 ? "s" : ""} atrás`;
}

// --- ROTAS DE AÇÃO (FLUXOS N8N) ---

app.post("/enviar-campanha", authMiddleware, async (req, res) => {
    const { nome_campanha, copy_mensagem, link_grupo, link_planilha, assinatura_campanha } = req.body;

    try {
        const { data, error } = await supabase
            .from("campanhas")
            .insert([{ 
                nome_campanha, 
                copy_mensagem, 
                link_grupo, 
                link_planilha, 
                assinatura: assinatura_campanha, 
                tipo: "individual", 
                user_id: req.user.id 
            }])
            .select()
            .single();

        if (error) {
            console.error("Erro do Supabase ao salvar campanha:", error.message);
            throw new Error("Falha ao registrar a campanha.");
        }

        res.status(200).json({ message: "Campanha recebida e fluxo iniciado com sucesso!"});
        
        if (N8N_WEBHOOK_URL_CAMPANHA) {
            try {
                await axios.post(N8N_WEBHOOK_URL_CAMPANHA, { campanhaId: data.id });
                console.log(`Webhook do n8n acionado para a campanha ID: ${data.id}`);
            } catch (webhookError) {
                console.error(`Erro ao acionar o webhook para a campanha ID: ${data.id}`, webhookError.message);
            }
        }

    } catch (error) {
        console.error("Erro fatal no processo de /enviar-campanha:", error.message);
        if (!res.headersSent) {
            res.status(500).json({ message: "Erro ao salvar campanha no banco de dados."});
        }
    }
});

app.post("/agendar-mensagem", authMiddleware, async (req, res) => {
    const { id_grupo_whatsapp, data_envio, copy_mensagem, link_aula, id_reuniao, senha_reuniao, assinatura_agendamento } = req.body;
    
    try {
        // CORREÇÃO: Mapear os campos para os nomes corretos das colunas no Supabase
        const { error } = await supabase
            .from("agendamentos")
            .insert([{ 
                id_grupo_whatsapp, 
                data_envio, 
                copy_mensagem, 
                link_aula, 
                id_reuniao, 
                senha: senha_reuniao,                    // ← Mapear para "senha"
                assinatura: assinatura_agendamento,      // ← Mapear para "assinatura"
                status: "pendente", 
                user_id: req.user.id 
            }]);
            
        if (error) {
            throw error;
        }
        
        res.status(200).json({ message: "Mensagem agendada com sucesso!"});
        
    } catch (error) {
        console.error("Erro na rota /agendar-mensagem:", error.message);
        res.status(500).json({ message: "Erro ao salvar o agendamento no servidor."});
    }
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor do Portal do Cliente rodando em http://localhost:${PORT}`);
});