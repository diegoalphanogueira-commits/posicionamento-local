document.addEventListener("DOMContentLoaded", function () {

    console.log("Posicionamento Local: JS carregado");

    /* =========================
       ANO
    ========================= */

    var year = document.getElementById("currentYear");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* =========================
       MENU MOBILE
    ========================= */

    var menuButton = document.getElementById("menuToggle");
    var mobileMenu = document.getElementById("mobileMenu");

    if (menuButton && mobileMenu) {

        menuButton.addEventListener("click", function () {

            mobileMenu.classList.toggle("active");

            var opened =
                mobileMenu.classList.contains("active");

            menuButton.setAttribute(
                "aria-expanded",
                opened ? "true" : "false"
            );

        });


        var menuLinks =
            mobileMenu.querySelectorAll("a");

        menuLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                mobileMenu.classList.remove("active");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    /* =========================
       WHATSAPP MASK
    ========================= */

    var phoneInput =
        document.getElementById("phone");

    if (phoneInput) {

        phoneInput.addEventListener("input", function () {

            var value =
                phoneInput.value.replace(/\D/g, "");

            value =
                value.substring(0, 11);


            if (value.length > 10) {

                phoneInput.value =
                    "(" +
                    value.substring(0, 2) +
                    ") " +
                    value.substring(2, 7) +
                    "-" +
                    value.substring(7, 11);

            }

            else if (value.length > 6) {

                phoneInput.value =
                    "(" +
                    value.substring(0, 2) +
                    ") " +
                    value.substring(2, 6) +
                    "-" +
                    value.substring(6, 10);

            }

            else if (value.length > 2) {

                phoneInput.value =
                    "(" +
                    value.substring(0, 2) +
                    ") " +
                    value.substring(2);

            }

            else if (value.length > 0) {

                phoneInput.value =
                    "(" + value;

            }

        });

    }


    /* =========================
       FORMULÁRIO
    ========================= */

    var form =
        document.getElementById("diagnosticForm");


    if (!form) {

        console.error(
            "Formulário diagnosticForm não encontrado."
        );

        return;

    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        console.log("Formulário interceptado com sucesso");


        var company =
            document
                .getElementById("company")
                .value
                .trim();


        var segment =
            document
                .getElementById("segment")
                .value
                .trim();


        var region =
            document
                .getElementById("region")
                .value
                .trim();


        var phone =
            document
                .getElementById("phone")
                .value
                .replace(/\D/g, "");


        if (!company) {

            alert("Informe o nome da empresa.");

            return;

        }


        if (!segment) {

            alert("Informe o segmento.");

            return;

        }


        if (!region) {

            alert("Informe sua cidade ou região.");

            return;

        }


        if (phone.length < 10) {

            alert("Informe um WhatsApp válido.");

            return;

        }


        /* =========================
           BOTÃO CARREGANDO
        ========================= */

        var button =
            form.querySelector(
                'button[type="submit"]'
            );


        if (button) {

            button.disabled = true;

            button.innerHTML =
                "Analisando sua região...";

        }


        /* =========================
           URL RADAR LOCAL
        ========================= */

        var radarUrl =
            "https://radar.metodoflow.com.br/";


        var params =
            new URLSearchParams();


        params.set(
            "empresa",
            company
        );


        params.set(
            "segmento",
            segment
        );


        params.set(
            "regiao",
            region
        );


        params.set(
            "telefone",
            phone
        );


        params.set(
            "origem",
            "posicionamento-local"
        );


        var destination =
            radarUrl +
            "?" +
            params.toString();


        console.log(
            "Abrindo:",
            destination
        );


        setTimeout(function () {

            window.location.href =
                destination;

        }, 500);

    });

});
