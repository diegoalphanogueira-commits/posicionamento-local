/* =========================================================
   POSICIONAMENTO LOCAL
   Integração com Radar Local
========================================================= */


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

/*
    COLE A URL REAL DO RADAR LOCAL AQUI.

    Exemplo:
    const RADAR_LOCAL_URL =
        "https://seuusuario.github.io/radar-local/";

    Se estiver dentro do mesmo domínio também pode ser:
    const RADAR_LOCAL_URL = "/radar-local/";
*/

const RADAR_LOCAL_URL =
    "https://radar.metodoflow360.com.br/";


/*
    Tempo curto para mostrar o estado "Analisando..."
    antes de abrir o Radar.
*/

const REDIRECT_DELAY = 700;



/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setCurrentYear();

        setupMobileMenu();

        setupPhoneMask();

        setupDiagnosticForm();

        setupSmoothMenuClose();

    }
);



/* =========================================================
   ANO AUTOMÁTICO
========================================================= */

function setCurrentYear() {

    const currentYear =
        document.getElementById(
            "currentYear"
        );


    if (!currentYear) {
        return;
    }


    currentYear.textContent =
        new Date().getFullYear();

}



/* =========================================================
   MENU MOBILE
========================================================= */

function setupMobileMenu() {

    const button =
        document.getElementById(
            "menuToggle"
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

            const isOpen =
                menu.classList.contains(
                    "active"
                );


            if (isOpen) {

                closeMobileMenu();

            } else {

                openMobileMenu();

            }

        }
    );



    function openMobileMenu() {

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



    function closeMobileMenu() {

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



    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 1060
            ) {

                closeMobileMenu();

            }

        }
    );

}



/* =========================================================
   FECHAR MENU AO CLICAR EM LINK
========================================================= */

function setupSmoothMenuClose() {

    const menu =
        document.getElementById(
            "mobileMenu"
        );


    const button =
        document.getElementById(
            "menuToggle"
        );


    if (!menu) {
        return;
    }



    menu
        .querySelectorAll("a")
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        menu.classList.remove(
                            "active"
                        );


                        document.body.classList.remove(
                            "menu-open"
                        );


                        if (button) {

                            button.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }

                    }
                );

            }
        );

}



/* =========================================================
   MÁSCARA WHATSAPP
========================================================= */

function setupPhoneMask() {

    const phone =
        document.getElementById(
            "phone"
        );


    if (!phone) {
        return;
    }



    phone.addEventListener(
        "input",
        (event) => {

            let value =
                event.target.value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .substring(
                        0,
                        11
                    );


            /*
                (11) 99999-9999
            */

            if (
                value.length <= 2
            ) {

                event.target.value =
                    value.length
                        ? `(${value}`
                        : "";

                return;

            }


            if (
                value.length <= 6
            ) {

                event.target.value =
                    `(${value.slice(0, 2)}) ${value.slice(2)}`;

                return;

            }


            if (
                value.length <= 10
            ) {

                event.target.value =
                    `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;

                return;

            }


            event.target.value =
                `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;

        }
    );

}



/* =========================================================
   FORMULÁRIO
========================================================= */

function setupDiagnosticForm() {

    const form =
        document.getElementById(
            "diagnosticForm"
        );


    if (!form) {
        return;
    }



    form.addEventListener(
        "submit",
        handleDiagnosticSubmit
    );

}



/* =========================================================
   ENVIO DO DIAGNÓSTICO
========================================================= */

function handleDiagnosticSubmit(
    event
) {

    event.preventDefault();



    const companyInput =
        document.getElementById(
            "company"
        );


    const segmentInput =
        document.getElementById(
            "segment"
        );


    const regionInput =
        document.getElementById(
            "region"
        );


    const phoneInput =
        document.getElementById(
            "phone"
        );


    const submitButton =
        document.querySelector(
            ".form-submit"
        );



    if (
        !companyInput ||
        !segmentInput ||
        !regionInput ||
        !phoneInput
    ) {

        return;

    }



    const company =
        companyInput.value.trim();


    const segment =
        segmentInput.value.trim();


    const region =
        regionInput.value.trim();


    const phone =
        phoneInput.value.trim();



    /* =====================================================
       VALIDAÇÕES
    ====================================================== */

    if (!company) {

        showFieldError(
            companyInput,
            "Digite o nome da empresa."
        );

        return;

    }


    if (!segment) {

        showFieldError(
            segmentInput,
            "Informe o segmento da empresa."
        );

        return;

    }


    if (!region) {

        showFieldError(
            regionInput,
            "Informe a cidade ou região."
        );

        return;

    }



    const phoneDigits =
        phone.replace(
            /\D/g,
            ""
        );


    if (
        phoneDigits.length < 10
    ) {

        showFieldError(
            phoneInput,
            "Digite um WhatsApp válido."
        );

        return;

    }



    /* =====================================================
       DADOS
    ====================================================== */

    const diagnosticData = {

        empresa:
            company,

        segmento:
            segment,

        regiao:
            region,

        telefone:
            phoneDigits,

        origem:
            "posicionamento-local",

        etapa:
            "landing-page"

    };



    /*
        Salva também localmente.

        Isso pode ser útil se depois o Radar estiver
        no mesmo domínio ou se quisermos recuperar
        essas informações durante a navegação.
    */

    saveDiagnosticData(
        diagnosticData
    );



    /* =====================================================
       EVENTO FUTURO
       META PIXEL / GTM / ANALYTICS
    ====================================================== */

    window.dispatchEvent(

        new CustomEvent(
            "localDiagnosticStarted",
            {

                detail:
                    diagnosticData

            }
        )

    );



    /* =====================================================
       ESTADO DO BOTÃO
    ====================================================== */

    if (submitButton) {

        submitButton.disabled =
            true;


        submitButton.dataset.originalText =
            submitButton.innerHTML;


        submitButton.innerHTML = `
            <span class="button-loading"></span>
            Analisando sua região...
        `;

    }



    /* =====================================================
       ABRIR RADAR
    ====================================================== */

    setTimeout(
        () => {

            openRadarLocal(
                diagnosticData,
                submitButton
            );

        },
        REDIRECT_DELAY
    );

}



/* =========================================================
   ABRIR RADAR LOCAL
========================================================= */

function openRadarLocal(
    data,
    submitButton
) {

    /*
        Enquanto a URL não estiver configurada,
        evitamos quebrar a experiência.
    */

    if (
        !RADAR_LOCAL_URL ||
        RADAR_LOCAL_URL.includes(
            "COLE_AQUI"
        )
    ) {

        restoreSubmitButton(
            submitButton
        );


        alert(
            "O Radar Local ainda precisa ser conectado. Configure a URL no início do script.js."
        );


        console.warn(
            "Configure RADAR_LOCAL_URL no início do script.js."
        );


        return;

    }



    try {

        const radarURL =
            new URL(
                RADAR_LOCAL_URL,
                window.location.href
            );



        /*
            DADOS PRINCIPAIS
        */

        radarURL.searchParams.set(
            "empresa",
            data.empresa
        );


        radarURL.searchParams.set(
            "segmento",
            data.segmento
        );


        radarURL.searchParams.set(
            "regiao",
            data.regiao
        );


        radarURL.searchParams.set(
            "telefone",
            data.telefone
        );


        radarURL.searchParams.set(
            "origem",
            data.origem
        );



        /*
            PRESERVA UTMs DA LANDING
            CASO TENHA VINDO DE ANÚNCIO.
        */

        copyTrackingParameters(
            radarURL
        );



        /*
            EXEMPLO:

            /radar-local/
            ?empresa=Studio%20Bella
            &segmento=Estética
            &regiao=Guarulhos%20SP
            &telefone=11999999999
            &origem=posicionamento-local
        */


        window.location.href =
            radarURL.toString();

    }

    catch (error) {

        console.error(
            "Erro ao abrir Radar Local:",
            error
        );


        restoreSubmitButton(
            submitButton
        );


        alert(
            "Não foi possível abrir o Radar Local. Verifique a URL configurada."
        );

    }

}



/* =========================================================
   SALVAR DADOS LOCALMENTE
========================================================= */

function saveDiagnosticData(
    data
) {

    try {

        localStorage.setItem(
            "radarLocalLead",
            JSON.stringify(
                {
                    ...data,

                    criadoEm:
                        new Date()
                            .toISOString()
                }
            )
        );

    }

    catch (error) {

        console.warn(
            "Não foi possível salvar os dados localmente.",
            error
        );

    }

}



/* =========================================================
   UTMs / ORIGEM DE TRÁFEGO
========================================================= */

function copyTrackingParameters(
    destinationURL
) {

    const currentParams =
        new URLSearchParams(
            window.location.search
        );


    const trackingParameters = [

        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
        "fbclid",
        "gclid"

    ];



    trackingParameters.forEach(
        (parameter) => {

            const value =
                currentParams.get(
                    parameter
                );


            if (value) {

                destinationURL
                    .searchParams
                    .set(
                        parameter,
                        value
                    );

            }

        }
    );

}



/* =========================================================
   ERRO VISUAL
========================================================= */

function showFieldError(
    input,
    message
) {

    clearFieldErrors();



    input.classList.add(
        "input-error"
    );


    const error =
        document.createElement(
            "span"
        );


    error.className =
        "field-error";


    error.textContent =
        message;


    input.parentElement
        .appendChild(
            error
        );


    input.focus();



    input.addEventListener(
        "input",
        () => {

            input.classList.remove(
                "input-error"
            );


            error.remove();

        },
        {
            once: true
        }
    );

}



/* =========================================================
   LIMPAR ERROS
========================================================= */

function clearFieldErrors() {

    document
        .querySelectorAll(
            ".input-error"
        )
        .forEach(
            (input) => {

                input.classList.remove(
                    "input-error"
                );

            }
        );


    document
        .querySelectorAll(
            ".field-error"
        )
        .forEach(
            (error) => {

                error.remove();

            }
        );

}



/* =========================================================
   RESTAURAR BOTÃO
========================================================= */

function restoreSubmitButton(
    button
) {

    if (!button) {
        return;
    }


    button.disabled =
        false;


    if (
        button.dataset.originalText
    ) {

        button.innerHTML =
            button.dataset.originalText;

    }

}

/* =========================================================
   FORM STATES
========================================================= */

.input-error {
    border-color: #ea4335 !important;

    box-shadow:
        0 0 0 4px rgba(234, 67, 53, 0.08) !important;
}

.field-error {
    display: block;

    margin-top: 6px;

    color: #ea4335;

    font-size: 0.66rem;

    font-weight: 600;
}

.form-submit:disabled {
    cursor: wait;

    opacity: 0.86;

    transform: none;
}

.button-loading {
    width: 17px;
    height: 17px;

    display: inline-block;

    border-radius: 50%;

    border:
        2px solid rgba(255, 255, 255, 0.35);

    border-top-color:
        #ffffff;

    animation:
        button-spin 0.7s linear infinite;
}

@keyframes button-spin {

    to {
        transform: rotate(360deg);
    }

}
