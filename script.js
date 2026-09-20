/* =========================================================
   CONFIGURAÇÕES
========================================================= */


/*
WHATSAPP DO DIEGO

Formato:
55 + DDD + número

Exemplo:
5511999999999
*/

const WHATSAPP_NUMBER = "5511999999999";


/*
URL DO RADAR LOCAL

COLE AQUI O LINK REAL DA FERRAMENTA.

Exemplo:

https://seudominio.github.io/radar-local/

ou

https://app.usekorax.com/diagnostico

NÃO coloque parâmetros depois da URL.
*/

const RADAR_LOCAL_URL =
    "COLE_AQUI_A_URL_DO_RADAR_LOCAL";



/* =========================================================
   CONFIGURAÇÃO DO QUIZ
========================================================= */

const TOTAL_STEPS = 6;

let currentStep = 1;


/*
RESPOSTAS
*/

const answers = {

    segmento: "",

    google: "",

    site: "",

    avaliacoes: "",

    objetivo: "",

    nome: "",

    empresa: "",

    cidade: "",

    telefone: ""

};



/* =========================================================
   INICIAR PÁGINA
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setCurrentYear();

        setupMobileMenu();

        setupWhatsApp();

        setupPhoneMask();

        setupQuiz();

    }
);



/* =========================================================
   ANO AUTOMÁTICO
========================================================= */

function setCurrentYear() {

    const element =
        document.getElementById(
            "currentYear"
        );


    if (!element) {
        return;
    }


    element.textContent =
        new Date().getFullYear();

}



/* =========================================================
   MENU MOBILE
========================================================= */

function setupMobileMenu() {

    const button =
        document.getElementById(
            "mobileMenuButton"
        );


    const menu =
        document.getElementById(
            "mobileMenu"
        );


    if (!button || !menu) {
        return;
    }



    button.addEventListener(
        "click",
        () => {

            const open =
                menu.classList.contains(
                    "active"
                );


            if (open) {

                closeMenu();

            } else {

                openMenu();

            }

        }
    );



    menu
        .querySelectorAll("a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                closeMenu
            );

        });



    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 1050
            ) {

                closeMenu();

            }

        }
    );



    function openMenu() {

        menu.classList.add(
            "active"
        );


        document.body.classList.add(
            "menu-open"
        );


        button.setAttribute(
            "aria-expanded",
            "true"
        );

    }



    function closeMenu() {

        menu.classList.remove(
            "active"
        );


        document.body.classList.remove(
            "menu-open"
        );


        button.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}



/* =========================================================
   WHATSAPP
========================================================= */

function setupWhatsApp() {

    const button =
        document.getElementById(
            "floatingWhatsapp"
        );


    if (!button) {
        return;
    }


    const message = `
Olá Diego!

Vi a página de Posicionamento Local e gostaria de entender como minha empresa pode aparecer melhor no Google e na minha região.
    `.trim();


    button.href =
        createWhatsAppURL(
            message
        );


    button.target =
        "_blank";


    button.rel =
        "noopener noreferrer";

}



/* =========================================================
   MÁSCARA TELEFONE
========================================================= */

function setupPhoneMask() {

    const input =
        document.getElementById(
            "quizPhone"
        );


    if (!input) {
        return;
    }



    input.addEventListener(
        "input",
        (event) => {

            let value =
                event.target.value
                    .replace(
                        /\D/g,
                        ""
                    );


            value =
                value.substring(
                    0,
                    11
                );



            if (
                value.length > 0
            ) {

                value =
                    "(" + value;

            }


            if (
                value.length > 3
            ) {

                value =
                    value.slice(
                        0,
                        3
                    ) +
                    ") " +
                    value.slice(3);

            }


            if (
                value.length > 10
            ) {

                value =
                    value.slice(
                        0,
                        10
                    ) +
                    "-" +
                    value.slice(10);

            }


            event.target.value =
                value;

        }
    );

}



/* =========================================================
   QUIZ
========================================================= */

function setupQuiz() {

    const quiz =
        document.getElementById(
            "localQuiz"
        );


    if (!quiz) {
        return;
    }


    const options =
        quiz.querySelectorAll(
            ".quiz-option"
        );


    const backButton =
        document.getElementById(
            "quizBack"
        );


    const finishButton =
        document.getElementById(
            "finishQuiz"
        );



    showStep(1);



    /* =====================================================
       RESPOSTAS
    ====================================================== */

    options.forEach(
        (option) => {

            option.addEventListener(
                "click",
                () => {

                    const step =
                        option.closest(
                            ".quiz-step"
                        );


                    if (!step) {
                        return;
                    }


                    const stepNumber =
                        Number(
                            step.dataset.step
                        );


                    const value =
                        option.dataset.value;



                    /*
                    REMOVE SELEÇÃO ANTERIOR
                    */

                    step
                        .querySelectorAll(
                            ".quiz-option"
                        )
                        .forEach(
                            (item) => {

                                item.classList
                                    .remove(
                                        "selected"
                                    );

                            }
                        );



                    /*
                    MARCA NOVA OPÇÃO
                    */

                    option.classList.add(
                        "selected"
                    );



                    /*
                    SALVA
                    */

                    saveAnswer(
                        stepNumber,
                        value
                    );



                    /*
                    AVANÇA
                    */

                    setTimeout(
                        () => {

                            if (
                                stepNumber <
                                TOTAL_STEPS
                            ) {

                                showStep(
                                    stepNumber + 1
                                );

                            }

                        },
                        180
                    );

                }
            );

        }
    );



    /* =====================================================
       VOLTAR
    ====================================================== */

    if (backButton) {

        backButton.addEventListener(
            "click",
            () => {

                if (
                    currentStep <= 1
                ) {

                    return;

                }


                showStep(
                    currentStep - 1
                );

            }
        );

    }



    /* =====================================================
       FINALIZAR
    ====================================================== */

    if (finishButton) {

        finishButton.addEventListener(
            "click",
            finishQuiz
        );

    }

}



/* =========================================================
   SALVAR RESPOSTA
========================================================= */

function saveAnswer(
    step,
    value
) {

    switch (step) {

        case 1:

            answers.segmento =
                value;

            break;


        case 2:

            answers.google =
                value;

            break;


        case 3:

            answers.site =
                value;

            break;


        case 4:

            answers.avaliacoes =
                value;

            break;


        case 5:

            answers.objetivo =
                value;

            break;

    }

}



/* =========================================================
   MOSTRAR PASSO
========================================================= */

function showStep(
    number
) {

    const steps =
        document.querySelectorAll(
            ".quiz-step"
        );


    const result =
        document.getElementById(
            "quizResult"
        );


    const back =
        document.getElementById(
            "quizBack"
        );



    if (result) {

        result.hidden = true;

    }



    steps.forEach(
        (step) => {

            step.hidden = true;

            step.classList.remove(
                "active"
            );

        }
    );



    const active =
        document.querySelector(
            `.quiz-step[data-step="${number}"]`
        );


    if (!active) {
        return;
    }



    active.hidden =
        false;


    active.classList.add(
        "active"
    );


    currentStep =
        number;



    if (back) {

        back.hidden =
            number === 1;

    }



    updateProgress();

}



/* =========================================================
   PROGRESSO
========================================================= */

function updateProgress() {

    const text =
        document.getElementById(
            "quizStepText"
        );


    const percentage =
        document.getElementById(
            "quizPercentage"
        );


    const bar =
        document.getElementById(
            "quizProgressBar"
        );


    const progress =
        Math.round(
            (
                currentStep /
                TOTAL_STEPS
            ) * 100
        );



    if (text) {

        text.textContent =
            `Pergunta ${currentStep} de ${TOTAL_STEPS}`;

    }


    if (percentage) {

        percentage.textContent =
            `${progress}%`;

    }


    if (bar) {

        bar.style.width =
            `${progress}%`;

    }

}



/* =========================================================
   FINALIZAR QUIZ
========================================================= */

function finishQuiz() {

    const name =
        document
            .getElementById(
                "quizName"
            )
            ?.value
            .trim();


    const company =
        document
            .getElementById(
                "quizCompany"
            )
            ?.value
            .trim();


    const city =
        document
            .getElementById(
                "quizCity"
            )
            ?.value
            .trim();


    const phone =
        document
            .getElementById(
                "quizPhone"
            )
            ?.value
            .trim();


    const consent =
        document
            .getElementById(
                "quizConsent"
            )
            ?.checked;



    /*
    VALIDAÇÃO
    */

    if (!name) {

        fieldError(
            "quizName"
        );

        return;

    }


    if (!company) {

        fieldError(
            "quizCompany"
        );

        return;

    }


    if (!city) {

        fieldError(
            "quizCity"
        );

        return;

    }


    if (!phone) {

        fieldError(
            "quizPhone"
        );

        return;

    }


    if (!consent) {

        alert(
            "Autorize o contato para finalizar o diagnóstico."
        );

        return;

    }



    /*
    SALVA
    */

    answers.nome =
        name;


    answers.empresa =
        company;


    answers.cidade =
        city;


    answers.telefone =
        phone;



    /*
    PRÉ-DIAGNÓSTICO
    */

    const priorities =
        calculatePriorities();



    /*
    RESULTADO
    */

    showResult(
        priorities
    );



    /*
    PREPARA LINK DO RADAR
    */

    setupRadarButton(
        priorities
    );



    /*
    EVENTO FUTURO
    META PIXEL / GTM
    */

    window.dispatchEvent(

        new CustomEvent(
            "localDiagnosticCompleted",
            {

                detail: {

                    ...answers,

                    priorities

                }

            }
        )

    );

}



/* =========================================================
   ERRO CAMPO
========================================================= */

function fieldError(id) {

    const input =
        document.getElementById(id);


    if (!input) {
        return;
    }


    input.focus();


    input.style.borderColor =
        "#ea4335";


    input.style.boxShadow =
        "0 0 0 4px rgba(234,67,53,.08)";


    setTimeout(
        () => {

            input.style.borderColor =
                "";


            input.style.boxShadow =
                "";

        },
        1800
    );

}



/* =========================================================
   CALCULAR PRIORIDADES
========================================================= */

function calculatePriorities() {

    const scores = {

        google: 0,

        site: 0,

        reputacao: 0

    };



    /* =====================================================
       GOOGLE
    ====================================================== */

    switch (
        answers.google
    ) {

        case "Não":

            scores.google += 6;

            break;


        case "Não sei":

            scores.google += 5;

            break;


        case "Sim, mas pouco estruturado":

            scores.google += 4;

            break;


        case "Sim, bem estruturado":

            scores.google += 1;

            break;

    }



    /* =====================================================
       SITE
    ====================================================== */

    switch (
        answers.site
    ) {

        case "Não":

            scores.site += 6;

            break;


        case "Sim, mas precisa melhorar":

            scores.site += 4;

            break;


        case "Sim":

            scores.site += 1;

            break;

    }



    /* =====================================================
       AVALIAÇÕES
    ====================================================== */

    switch (
        answers.avaliacoes
    ) {

        case "Quase nenhuma":

            scores.reputacao += 6;

            break;


        case "Temos poucas avaliações":

            scores.reputacao += 4;

            break;


        case "Não sei":

            scores.reputacao += 4;

            break;


        case "Temos muitas avaliações":

            scores.reputacao += 1;

            break;

    }



    /* =====================================================
       CENÁRIO
    ====================================================== */

    switch (
        answers.objetivo
    ) {

        case "Dependemos muito de indicação":

            scores.google += 3;

            scores.site += 2;

            scores.reputacao += 2;

            break;


        case "Queremos aparecer mais no Google":

            scores.google += 5;

            break;


        case "Queremos transmitir mais confiança":

            scores.site += 3;

            scores.reputacao += 4;

            break;


        case "Queremos gerar mais oportunidades":

            scores.google += 3;

            scores.site += 2;

            scores.reputacao += 2;

            break;


        case "Precisamos organizar tudo":

            scores.google += 4;

            scores.site += 4;

            scores.reputacao += 4;

            break;

    }



    /*
    ORDENA
    */

    const ordered =
        Object
            .entries(scores)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );



    /*
    SE OS TRÊS ESTÃO ALTOS,
    MOSTRA ESTRUTURA COMPLETA
    */

    const strongProblems =
        ordered.filter(
            ([, score]) =>
                score >= 5
        );


    if (
        strongProblems.length === 3
    ) {

        return [

            {
                key:
                    "estrutura",

                label:
                    "Estrutura Local Completa",

                score:
                    strongProblems
                        .reduce(
                            (
                                total,
                                [, score]
                            ) =>
                                total +
                                score,
                            0
                        )

            },

            ...ordered
                .slice(0, 2)
                .map(
                    ([key, score]) => ({

                        key,

                        score,

                        label:
                            getPriorityLabel(
                                key
                            )

                    })
                )

        ];

    }



    return ordered
        .slice(0, 3)
        .map(
            ([key, score]) => ({

                key,

                score,

                label:
                    getPriorityLabel(
                        key
                    )

            })
        );

}



/* =========================================================
   NOMES
========================================================= */

function getPriorityLabel(
    key
) {

    const labels = {

        google:
            "Google + SEO Local",

        site:
            "Site Profissional",

        reputacao:
            "Avaliações e Reputação",

        estrutura:
            "Estrutura Local Completa"

    };


    return (
        labels[key] ||
        key
    );

}



/* =========================================================
   EXIBIR RESULTADO
========================================================= */

function showResult(
    priorities
) {

    const steps =
        document.querySelectorAll(
            ".quiz-step"
        );


    const result =
        document.getElementById(
            "quizResult"
        );


    const container =
        document.getElementById(
            "resultPriorities"
        );


    const back =
        document.getElementById(
            "quizBack"
        );



    steps.forEach(
        (step) => {

            step.hidden = true;

        }
    );



    if (back) {

        back.hidden = true;

    }



    if (container) {

        container.innerHTML =
            "";


        priorities.forEach(
            (priority) => {

                const tag =
                    document.createElement(
                        "span"
                    );


                tag.textContent =
                    priority.label;


                container.appendChild(
                    tag
                );

            }
        );

    }



    if (result) {

        result.hidden =
            false;

    }



    /*
    MUDA TEXTO DO BOTÃO
    */

    const radarButton =
        document.getElementById(
            "resultWhatsapp"
        );


    if (radarButton) {

        radarButton.textContent =
            "Analisar minha região no Radar Local";

    }



    /*
    100%
    */

    const stepText =
        document.getElementById(
            "quizStepText"
        );


    const percentage =
        document.getElementById(
            "quizPercentage"
        );


    const bar =
        document.getElementById(
            "quizProgressBar"
        );


    if (stepText) {

        stepText.textContent =
            "Pré-diagnóstico concluído";

    }


    if (percentage) {

        percentage.textContent =
            "100%";

    }


    if (bar) {

        bar.style.width =
            "100%";

    }

}



/* =========================================================
   LINK PARA RADAR LOCAL
========================================================= */

function setupRadarButton(
    priorities
) {

    const button =
        document.getElementById(
            "resultWhatsapp"
        );


    if (!button) {
        return;
    }



    /*
    VERIFICA URL
    */

    if (
        !RADAR_LOCAL_URL ||
        RADAR_LOCAL_URL.includes(
            "COLE_AQUI"
        )
    ) {

        console.warn(
            "Configure RADAR_LOCAL_URL no início do script.js."
        );


        button.href =
            "#";


        button.addEventListener(
            "click",
            radarNotConfigured,
            {
                once: true
            }
        );


        return;

    }



    /*
    CRIA URL
    */

    const url =
        new URL(
            RADAR_LOCAL_URL
        );



    /*
    PARÂMETROS QUE SERÃO
    ENVIADOS PARA O RADAR
    */

    url.searchParams.set(
        "empresa",
        answers.empresa
    );


    url.searchParams.set(
        "segmento",
        answers.segmento
    );


    url.searchParams.set(
        "regiao",
        answers.cidade
    );


    url.searchParams.set(
        "nome",
        answers.nome
    );


    url.searchParams.set(
        "telefone",
        answers.telefone
    );


    url.searchParams.set(
        "origem",
        "posicionamento-local"
    );


    url.searchParams.set(
        "prioridade",
        priorities[0]?.key ||
        ""
    );



    /*
    EXEMPLO FINAL:

    radar-local.com/
    ?empresa=Studio%20X
    &segmento=Estética
    &regiao=Guarulhos
    &origem=posicionamento-local
    */



    button.href =
        url.toString();


    button.target =
        "_self";


    button.rel =
        "noopener";

}



/* =========================================================
   RADAR NÃO CONFIGURADO
========================================================= */

function radarNotConfigured(
    event
) {

    event.preventDefault();


    alert(
        "O link do Radar Local ainda precisa ser configurado no script.js."
    );

}



/* =========================================================
   WHATSAPP URL
========================================================= */

function createWhatsAppURL(
    message
) {

    const encoded =
        encodeURIComponent(
            message
        );


    return (
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encoded
    );

}
