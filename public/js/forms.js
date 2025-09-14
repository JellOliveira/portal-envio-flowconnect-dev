/* Conteúdo para public/js/forms.js */
document.addEventListener('DOMContentLoaded', function() {

    // SCRIPT DO FORMULÁRIO DE CAMPANHA (CORRIGIDO)
    const campaignForm = document.getElementById('campaign-form'); // ID com hífen
    if (campaignForm) {
        const submitBtn = campaignForm.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn.innerHTML;

        campaignForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<div class="spinner"></div> Enviando...';
                if (window.lucide) lucide.createIcons();

                const campaignData = {
                    nome_campanha: document.getElementById('nome_campanha').value,
                    link_planilha: document.getElementById('link_planilha').value,
                    copy_mensagem: document.getElementById('copy_mensagem').value,
                    link_grupo: document.getElementById('link_grupo').value,
                    assinatura_campanha: document.getElementById('assinatura_campanha').value // Nome correto
                };

                const response = await fetch('/enviar-campanha', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(campaignData)
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.message);

                if (window.FlowConnect && window.FlowConnect.showToast) {
                    window.FlowConnect.showToast('Campanha recebida e fluxo iniciado!', 'success');
                }
                
                campaignForm.reset();

            } catch (error) {
                if (window.FlowConnect && window.FlowConnect.showToast) {
                    window.FlowConnect.showToast(error.message || 'Erro ao enviar campanha.', 'error');
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
                if (window.lucide) lucide.createIcons();
            }
        });
    }

    // SCRIPT DO FORMULÁRIO DE AGENDAMENTO (CORRIGIDO)
    const scheduleForm = document.getElementById('schedule-form'); // ID com hífen
    if (scheduleForm) {
        const submitBtn = scheduleForm.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn.innerHTML;

        scheduleForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<div class="spinner"></div> Agendando...';
                if (window.lucide) lucide.createIcons();

                const scheduleData = {
                    id_grupo_whatsapp: document.getElementById('id_grupo_whatsapp').value,
                    data_envio: document.getElementById('data_envio').value,
                    copy_mensagem: document.getElementById('copy_mensagem_aula').value, // ID correto
                    link_aula: document.getElementById('link_aula').value,
                    id_reuniao: document.getElementById('id_reuniao').value,
                    senha_reuniao: document.getElementById('senha_reuniao').value,
                    assinatura_agendamento: document.getElementById('assinatura_agendamento').value // Nome correto
                };

                const response = await fetch('/agendar-mensagem', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(scheduleData)
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.message);

                if (window.FlowConnect && window.FlowConnect.showToast) {
                    window.FlowConnect.showToast('Mensagem agendada com sucesso!', 'success');
                }

                scheduleForm.reset();

            } catch (error) {
                if (window.FlowConnect && window.FlowConnect.showToast) {
                    window.FlowConnect.showToast(error.message || 'Erro ao agendar mensagem.', 'error');
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHTML;
                if (window.lucide) lucide.createIcons();
            }
        });
    }
});