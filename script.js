/* =========================================================
   POSICIONAMENTO LOCAL
   LANDING → RADAR LOCAL
   V2
========================================================= */


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const GEOAPIFY_API_KEY =
    "61752d18dba9485784b870f8d4e38b17";


const RADAR_LOCAL_URL =
    "https://diegoalphanogueira-commits.github.io/radar-local/";


const CITY_SEARCH_DELAY =
    350;


/* =========================================================
   ESTADO
========================================================= */

let citySearchTimer = null;

let cityAbortController = null;

let selectedCity = null;

/* =========================================================
   BUSCA DA EMPRESA / ENDEREÇO
========================================================= */

let businessSearchTimer = null;

let businessAbortController = null;

let selectedBusiness = null;

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setCurrentYear();

        setupMobileMenu();

        setupSmoothMenuClose();

        setupPhoneMask();

        setupCityAutocomplete();

       setupBusinessAutocomplete();
       
       setupCustomSegment();

       /* =========================================================
   OUTRO SEGMENTO
========================================================= */

function setupCustomSegment() {

    const segment =
        document.getElementById(
            "segment"
        );

    const customField =
        document.getElementById(
            "customSegmentField"
        );

    const customInput =
        document.getElementById(
            "customSegment"
        );


    if (
        !segment ||
        !customField ||
        !customInput
    ) {

        return;

    }


    function updateCustomSegment() {

        const isOther =
            segment.value ===
            "outro";


        customField
            .classList
            .toggle(
                "hidden",
                !isOther
            );


        customInput.required =
            isOther;


        if (
            !isOther
        ) {

            customInput.value =
                "";

        }

    }


    segment.addEventListener(
        "change",
        updateCustomSegment
    );


    updateCustomSegment();

}

        setupDiagnosticForm();

    }
);

/* =========================================================
   ANO
========================================================= */

function setCurrentYear() {

    const year =
        document.getElementById(
            "currentYear"
        );


    if (year) {

        year.textContent =
            new Date()
                .getFullYear();

    }

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


    if (
        !button ||
        !menu
    ) {

        return;

    }


    button.addEventListener(
        "click",
        function () {

            const opened =
                menu.classList.toggle(
                    "active"
                );


            document.body
                .classList
                .toggle(
                    "menu-open",
                    opened
                );


            button.setAttribute(
                "aria-expanded",
                opened
                    ? "true"
                    : "false"
            );

        }
    );

}


/* =========================================================
   FECHAR MENU
========================================================= */

function setupSmoothMenuClose() {

    const button =
        document.getElementById(
            "menuToggle"
        );


    const menu =
        document.getElementById(
            "mobileMenu"
        );


    if (
        !button ||
        !menu
    ) {

        return;

    }


    menu
        .querySelectorAll("a")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        menu.classList.remove(
                            "active"
                        );


                        document.body
                            .classList
                            .remove(
                                "menu-open"
                            );


                        button.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   WHATSAPP
========================================================= */

function setupPhoneMask() {

    const input =
        document.getElementById(
            "phone"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            let value =
                input.value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .substring(
                        0,
                        11
                    );


            if (
                value.length > 10
            ) {

                input.value =
                    "(" +
                    value.substring(
                        0,
                        2
                    ) +
                    ") " +
                    value.substring(
                        2,
                        7
                    ) +
                    "-" +
                    value.substring(
                        7,
                        11
                    );

                return;

            }


            if (
                value.length > 6
            ) {

                input.value =
                    "(" +
                    value.substring(
                        0,
                        2
                    ) +
                    ") " +
                    value.substring(
                        2,
                        6
                    ) +
                    "-" +
                    value.substring(
                        6,
                        10
                    );

                return;

            }


            if (
                value.length > 2
            ) {

                input.value =
                    "(" +
                    value.substring(
                        0,
                        2
                    ) +
                    ") " +
                    value.substring(2);

                return;

            }


            if (
                value.length > 0
            ) {

                input.value =
                    "(" +
                    value;

                return;

            }


            input.value = "";

        }
    );

}


/* =========================================================
   AUTOCOMPLETE DA CIDADE
========================================================= */

function setupCityAutocomplete() {

    const input =
        document.getElementById(
            "region"
        );


    const suggestions =
        document.getElementById(
            "regionSuggestions"
        );


    if (
        !input ||
        !suggestions
    ) {

        return;

    }


    input.addEventListener(
        "input",
        function () {

            const query =
                input.value
                    .trim();


            /*
                Se começar a editar novamente,
                desfaz a cidade selecionada.
            */

            selectedCity =
                null;


            clearCityHiddenFields();


            clearTimeout(
                citySearchTimer
            );


            if (
                query.length < 2
            ) {

                hideCitySuggestions();

                setCityLoading(
                    false
                );

                return;

            }


            citySearchTimer =
                setTimeout(
                    function () {

                        searchCities(
                            query
                        );

                    },
                    CITY_SEARCH_DELAY
                );

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            const field =
                input.closest(
                    ".region-search-field"
                );


            if (
                field &&
                !field.contains(
                    event.target
                )
            ) {

                hideCitySuggestions();

            }

        }
    );

}


/* =========================================================
   BUSCAR CIDADES NO GEOAPIFY
========================================================= */

async function searchCities(
    query
) {

    if (
        !GEOAPIFY_API_KEY ||
        GEOAPIFY_API_KEY.includes(
            "COLE_SUA"
        )
    ) {

        renderCityMessage(
            "Configure a chave do Geoapify."
        );

        return;

    }


    if (
        cityAbortController
    ) {

        cityAbortController.abort();

    }


    cityAbortController =
        new AbortController();


    setCityLoading(
        true
    );


    try {

        const url =
            new URL(
                "https://api.geoapify.com/v1/geocode/autocomplete"
            );


        url.searchParams.set(
            "text",
            query
        );


        url.searchParams.set(
            "type",
            "city"
        );


        url.searchParams.set(
            "filter",
            "countrycode:br"
        );


        url.searchParams.set(
            "lang",
            "pt"
        );


        url.searchParams.set(
            "limit",
            "5"
        );


        url.searchParams.set(
            "apiKey",
            GEOAPIFY_API_KEY
        );


        const response =
            await fetch(
                url.toString(),
                {
                    signal:
                        cityAbortController.signal
                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Erro Geoapify: " +
                response.status
            );

        }


        const payload =
            await response.json();


        console.log(
            "Resposta Geoapify:",
            payload
        );


        let results = [];


        /*
            Geoapify pode devolver:

            1. results[]
            2. features[] em GeoJSON
        */

        if (
            Array.isArray(
                payload.results
            )
        ) {

            results =
                payload.results;

        }

        else if (
            Array.isArray(
                payload.features
            )
        ) {

            results =
                payload.features.map(
                    function (feature) {

                        const properties =
                            feature.properties ||
                            {};


                        /*
                            Em alguns formatos,
                            latitude/longitude ficam
                            em geometry.coordinates.
                        */

                        if (
                            feature.geometry &&
                            Array.isArray(
                                feature.geometry.coordinates
                            )
                        ) {

                            properties.lon =
                                properties.lon ??
                                feature.geometry.coordinates[0];


                            properties.lat =
                                properties.lat ??
                                feature.geometry.coordinates[1];

                        }


                        return properties;

                    }
                );

        }


        console.log(
            "Cidades encontradas:",
            results
        );


        renderCitySuggestions(
            results
        );

    }

    catch (error) {

        if (
            error.name ===
            "AbortError"
        ) {

            return;

        }


        console.error(
            "Erro ao buscar cidade:",
            error
        );


        renderCityMessage(
            "Não foi possível localizar a cidade agora."
        );

    }

    finally {

        setCityLoading(
            false
        );

    }

}


/* =========================================================
   RENDERIZAR CIDADES
========================================================= */

function renderCitySuggestions(
    results
) {

    const container =
        document.getElementById(
            "regionSuggestions"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    if (
        !results.length
    ) {

        renderCityMessage(
            "Nenhuma cidade encontrada."
        );

        return;

    }


    results.forEach(
        function (place) {

            const city =
                place.city ||
                place.name ||
                place.town ||
                place.village ||
                "";


            if (!city) {
                return;
            }


            const stateCode =
                getBrazilStateCode(
                    place.state_code ||
                    place.state ||
                    ""
                );


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "place-suggestion";


            const icon =
                document.createElement(
                    "span"
                );


            icon.className =
                "place-suggestion-icon";


            icon.textContent =
                "◎";


            const copy =
                document.createElement(
                    "span"
                );


            copy.className =
                "place-suggestion-copy";


            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                stateCode
                    ? `${city} - ${stateCode}`
                    : city;


            const subtitle =
                document.createElement(
                    "span"
                );


            subtitle.textContent =
                [
                    place.state,
                    "Brasil"
                ]
                    .filter(Boolean)
                    .join(", ");


            copy.appendChild(
                title
            );


            copy.appendChild(
                subtitle
            );


            button.appendChild(
                icon
            );


            button.appendChild(
                copy
            );


            button.addEventListener(
                "click",
                function () {

                    selectCity(
                        place
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );


    container.classList.remove(
        "hidden"
    );

}


/* =========================================================
   SELECIONAR CIDADE
========================================================= */

function selectCity(
    place
) {

    const input =
        document.getElementById(
            "region"
        );


    const city =
        place.city ||
        place.name ||
        place.town ||
        place.village ||
        "";


    const stateCode =
        getBrazilStateCode(
            place.state_code ||
            place.state ||
            ""
        );


    const formatted =
        stateCode
            ? `${city} - ${stateCode}`
            : city;


    selectedCity = {

        name:
            city,

        state:
            place.state ||
            "",

        stateCode,

        lat:
            place.lat ??
            "",

        lon:
            place.lon ??
            "",

        placeId:
            place.place_id ||
            ""

    };


    if (
        input
    ) {

        input.value =
            formatted;

    }


    setInputValue(
        "cityName",
        city
    );


    setInputValue(
        "cityState",
        stateCode
    );


    setInputValue(
        "cityLat",
        place.lat ??
        ""
    );


    setInputValue(
        "cityLon",
        place.lon ??
        ""
    );


    setInputValue(
        "cityPlaceId",
        place.place_id ||
        ""
    );


    hideCitySuggestions();

}


/* =========================================================
   UF
========================================================= */

function getBrazilStateCode(
    value
) {

    const raw =
        String(
            value ||
            ""
        )
            .trim();


    if (
        /^[A-Za-z]{2}$/.test(
            raw
        )
    ) {

        return raw.toUpperCase();

    }


    const normalized =
        normalizeText(
            raw
        );


    const states = {

        "acre":
            "AC",

        "alagoas":
            "AL",

        "amapa":
            "AP",

        "amazonas":
            "AM",

        "bahia":
            "BA",

        "ceara":
            "CE",

        "distrito federal":
            "DF",

        "espirito santo":
            "ES",

        "goias":
            "GO",

        "maranhao":
            "MA",

        "mato grosso":
            "MT",

        "mato grosso do sul":
            "MS",

        "minas gerais":
            "MG",

        "para":
            "PA",

        "paraiba":
            "PB",

        "parana":
            "PR",

        "pernambuco":
            "PE",

        "piaui":
            "PI",

        "rio de janeiro":
            "RJ",

        "rio grande do norte":
            "RN",

        "rio grande do sul":
            "RS",

        "rondonia":
            "RO",

        "roraima":
            "RR",

        "santa catarina":
            "SC",

        "sao paulo":
            "SP",

        "sergipe":
            "SE",

        "tocantins":
            "TO"

    };


    return (
        states[
            normalized
        ] ||
        ""
    );

}


/* =========================================================
   NORMALIZAR TEXTO
========================================================= */

function normalizeText(
    value
) {

    return String(
        value ||
        ""
    )
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

}


/* =========================================================
   HELPERS DA CIDADE
========================================================= */

function hideCitySuggestions() {

    const container =
        document.getElementById(
            "regionSuggestions"
        );


    if (
        container
    ) {

        container.classList.add(
            "hidden"
        );

    }

}


function setCityLoading(
    loading
) {

    const loader =
        document.getElementById(
            "regionSearchLoader"
        );


    if (!loader) {
        return;
    }


    loader.classList.toggle(
        "hidden",
        !loading
    );

}


function renderCityMessage(
    message
) {

    const container =
        document.getElementById(
            "regionSuggestions"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    const item =
        document.createElement(
            "div"
        );


    item.style.padding =
        "15px 16px";


    item.style.fontSize =
        ".72rem";


    item.style.color =
        "#7d8898";


    item.textContent =
        message;


    container.appendChild(
        item
    );


    container.classList.remove(
        "hidden"
    );

}


function clearCityHiddenFields() {

    [
        "cityName",
        "cityState",
        "cityLat",
        "cityLon",
        "cityPlaceId"
    ]
        .forEach(
            function (id) {

                setInputValue(
                    id,
                    ""
                );

            }
        );

}


function setInputValue(
    id,
    value
) {

    const input =
        document.getElementById(
            id
        );


    if (
        input
    ) {

        input.value =
            value;

    }

}


/* =========================================================
   ERROS
========================================================= */

function clearErrors() {

    document
        .querySelectorAll(
            ".input-error"
        )
        .forEach(
            function (element) {

                element.classList.remove(
                    "input-error"
                );

            }
        );


    document
        .querySelectorAll(
            ".field-error"
        )
        .forEach(
            function (element) {

                element.remove();

            }
        );

}


function showError(
    input,
    message
) {

    if (!input) {
        return;
    }


    input.classList.add(
        "input-error"
    );


    const error =
        document.createElement(
            "small"
        );


    error.className =
        "field-error";


    error.textContent =
        message;


    const parent =
        input.closest(
            ".field"
        ) ||
        input.parentElement;


    if (
        parent
    ) {

        parent.appendChild(
            error
        );

    }

}

/* =========================================================
   AUTOCOMPLETE DA EMPRESA / ENDEREÇO
========================================================= */

function setupBusinessAutocomplete() {

    const input =
        document.getElementById(
            "businessQuery"
        );


    const suggestions =
        document.getElementById(
            "businessSuggestions"
        );


    if (
        !input ||
        !suggestions
    ) {

        return;

    }


    input.addEventListener(
        "input",
        function () {

            const query =
                input.value
                    .trim();


            selectedBusiness =
                null;


            clearTimeout(
                businessSearchTimer
            );


            if (
                query.length < 2
            ) {

                hideBusinessSuggestions();

                setBusinessLoading(
                    false
                );

                return;

            }


            /*
                Não procura empresa
                antes de selecionar a cidade.
            */

            if (
                !selectedCity
            ) {

                renderBusinessMessage(
                    "Selecione primeiro sua cidade ou região."
                );

                return;

            }


            businessSearchTimer =
                setTimeout(
                    function () {

                        searchBusinessesGeoapify(
                            query
                        );

                    },
                    400
                );

        }
    );


    /*
        Botão ALTERAR
    */

    const changeButton =
        document.getElementById(
            "changeBusinessButton"
        );


    if (
        changeButton
    ) {

        changeButton.addEventListener(
            "click",
            function () {

                clearSelectedBusiness();

                input.focus();

            }
        );

    }


    /*
        Fecha sugestões ao clicar fora.
    */

    document.addEventListener(
        "click",
        function (event) {

            const field =
                input.closest(
                    ".business-search-field"
                );


            if (
                field &&
                !field.contains(
                    event.target
                )
            ) {

                hideBusinessSuggestions();

            }

        }
    );

}


async function searchBusinessesGeoapify(
    query
) {

    if (
        !GEOAPIFY_API_KEY ||
        GEOAPIFY_API_KEY.includes(
            "COLE_SUA"
        )
    ) {

        renderBusinessMessage(
            "Busca de endereço ainda não configurada."
        );

        return;

    }


    if (
        !selectedCity
    ) {

        renderBusinessMessage(
            "Selecione primeiro sua cidade."
        );

        return;

    }


    if (
        businessAbortController
    ) {

        businessAbortController.abort();

    }


    businessAbortController =
        new AbortController();


    setBusinessLoading(
        true
    );


    try {

        const url =
            new URL(
                "https://api.geoapify.com/v1/geocode/autocomplete"
            );


        /*
            Sempre buscamos ENDEREÇO.

            Exemplo final:
            Rua Waldemar de Paula Ferreira, 663,
            Guarulhos, SP, Brasil
        */

        const searchText =
            [
                query,
                selectedCity.name,
                selectedCity.stateCode,
                "Brasil"
            ]
                .filter(Boolean)
                .join(", ");


        url.searchParams.set(
            "text",
            searchText
        );


        url.searchParams.set(
            "format",
            "json"
        );


        url.searchParams.set(
            "filter",
            "countrycode:br"
        );


        /*
            Dá preferência para endereços
            próximos à cidade escolhida.
        */

        if (
            selectedCity.lat &&
            selectedCity.lon
        ) {

            url.searchParams.set(
                "bias",
                `proximity:${selectedCity.lon},${selectedCity.lat}`
            );

        }


        url.searchParams.set(
            "lang",
            "pt"
        );


        url.searchParams.set(
            "limit",
            "6"
        );


        url.searchParams.set(
            "apiKey",
            GEOAPIFY_API_KEY
        );


        const response =
            await fetch(
                url.toString(),
                {
                    signal:
                        businessAbortController.signal
                }
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "Geoapify respondeu com status " +
                response.status
            );

        }


        const payload =
            await response.json();


        let results = [];


        if (
            Array.isArray(
                payload.results
            )
        ) {

            results =
                payload.results;

        }

        else if (
            Array.isArray(
                payload.features
            )
        ) {

            results =
                payload.features.map(
                    function (feature) {

                        const properties =
                            feature.properties ||
                            {};


                        if (
                            feature.geometry &&
                            Array.isArray(
                                feature.geometry.coordinates
                            )
                        ) {

                            properties.lon =
                                properties.lon ??
                                feature.geometry.coordinates[0];


                            properties.lat =
                                properties.lat ??
                                feature.geometry.coordinates[1];

                        }


                        return properties;

                    }
                );

        }


        /*
            Mantemos primeiro os resultados
            realmente relacionados à cidade.
        */

        const cityName =
            normalizeText(
                selectedCity.name
            );


        results =
            results.sort(
                function (
                    a,
                    b
                ) {

                    const cityA =
                        normalizeText(
                            a.city ||
                            a.town ||
                            a.village ||
                            ""
                        );


                    const cityB =
                        normalizeText(
                            b.city ||
                            b.town ||
                            b.village ||
                            ""
                        );


                    const scoreA =
                        cityA === cityName
                            ? 1
                            : 0;


                    const scoreB =
                        cityB === cityName
                            ? 1
                            : 0;


                    return (
                        scoreB -
                        scoreA
                    );

                }
            );


        console.log(
            "Endereços encontrados:",
            results
        );


        renderBusinessSuggestions(
            results.slice(
                0,
                5
            )
        );

    }

    catch (error) {

        if (
            error.name ===
            "AbortError"
        ) {

            return;

        }


        console.error(
            "Erro ao buscar endereço:",
            error
        );


        renderBusinessMessage(
            "Não foi possível localizar esse endereço agora."
        );

    }

    finally {

        setBusinessLoading(
            false
        );

    }

}

       


/* =========================================================
   RENDERIZAR RESULTADOS
========================================================= */

function renderBusinessSuggestions(
    results
) {

    const container =
        document.getElementById(
            "businessSuggestions"
        );


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    if (
        !results.length
    ) {

        renderBusinessMessage(
            "Nenhum endereço encontrado."
        );

        return;

    }


    results.forEach(
        function (place) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "place-suggestion";


            const icon =
                document.createElement(
                    "span"
                );


            icon.className =
                "place-suggestion-icon";


            icon.textContent =
                "◎";


            const copy =
                document.createElement(
                    "span"
                );


            copy.className =
                "place-suggestion-copy";


            const title =
                document.createElement(
                    "strong"
                );


            /*
                Aqui mostramos o endereço,
                não o nome do estabelecimento.
            */

            title.textContent =
                place.address_line1 ||
                [
                    place.street,
                    place.housenumber
                ]
                    .filter(Boolean)
                    .join(", ") ||
                place.formatted ||
                "Endereço encontrado";


            const subtitle =
                document.createElement(
                    "span"
                );


            subtitle.textContent =
                [
                    place.suburb,
                    place.city ||
                    place.town ||
                    place.village,
                    place.state_code ||
                    place.state
                ]
                    .filter(Boolean)
                    .join(" · ");


            copy.appendChild(
                title
            );


            copy.appendChild(
                subtitle
            );


            button.appendChild(
                icon
            );


            button.appendChild(
                copy
            );


            button.addEventListener(
                "click",
                function () {

                    selectBusinessGeoapify(
                        place
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );


    container.classList.remove(
        "hidden"
    );

}

/* =========================================================
   SELECIONAR ESTABELECIMENTO
========================================================= */

function selectBusinessGeoapify(
    place
) {

    const companyInput =
        document.getElementById(
            "company"
        );


    const companyName =
        companyInput
            ?.value
            .trim() ||
        "";


    selectedBusiness = {

        /*
            Nome informado pela pessoa.
        */

        name:
            companyName,

        /*
            Identificação real do endereço.
        */

        placeId:
            place.place_id ||
            "",

        address:
            place.formatted ||
            "",

        lat:
            place.lat ??
            "",

        lon:
            place.lon ??
            "",

        city:
            place.city ||
            place.town ||
            place.village ||
            selectedCity?.name ||
            "",

        state:
            place.state ||
            selectedCity?.state ||
            "",

        stateCode:
            place.state_code ||
            selectedCity?.stateCode ||
            "",

        postcode:
            place.postcode ||
            "",

        suburb:
            place.suburb ||
            "",

        resultType:
            place.result_type ||
            ""

    };


    fillBusinessHiddenFields();


    renderSelectedBusiness();


    hideBusinessSuggestions();

}


/* =========================================================
   PREENCHER DADOS INVISÍVEIS
========================================================= */

function fillBusinessHiddenFields() {

    if (
        !selectedBusiness
    ) {

        return;

    }


    setInputValue(
        "businessPlaceId",
        selectedBusiness.placeId
    );


    setInputValue(
        "businessName",
        selectedBusiness.name
    );


    setInputValue(
        "businessAddress",
        selectedBusiness.address
    );


    setInputValue(
        "businessLat",
        selectedBusiness.lat
    );


    setInputValue(
        "businessLon",
        selectedBusiness.lon
    );


    /*
        Geoapify não fornece
        avaliações do Google.

        Mantemos vazios.
    */

    setInputValue(
        "businessRating",
        ""
    );


    setInputValue(
        "businessRatingCount",
        ""
    );


    setInputValue(
        "businessType",
        selectedBusiness.category ||
        selectedBusiness.resultType
    );

}


/* =========================================================
   MOSTRAR CARD DO LOCAL
========================================================= */

function renderSelectedBusiness() {

    if (
        !selectedBusiness
    ) {

        return;

    }


    const input =
        document.getElementById(
            "businessQuery"
        );


    const card =
        document.getElementById(
            "selectedBusinessCard"
        );


    const name =
        document.getElementById(
            "selectedBusinessName"
        );


    const address =
        document.getElementById(
            "selectedBusinessAddress"
        );


    const meta =
        document.getElementById(
            "selectedBusinessMeta"
        );


    if (
        name
    ) {

        name.textContent =
            selectedBusiness.name;

    }


    if (
        address
    ) {

        address.textContent =
            selectedBusiness.address ||
            "Endereço identificado";

    }


    if (
        meta
    ) {

        const parts =
            [];


        if (
            selectedBusiness.category
        ) {

            parts.push(
                selectedBusiness.category
            );

        }


        if (
            selectedBusiness.city
        ) {

            parts.push(
                selectedBusiness.city
            );

        }


        meta.textContent =
            parts.join(
                " · "
            );

    }


    if (
        input
    ) {

        input.value =
            selectedBusiness.name;


        input
            .closest(
                ".place-search-wrapper"
            )
            ?.classList
            .add(
                "hidden"
            );

    }


    if (
        card
    ) {

        card.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   ALTERAR LOCAL
========================================================= */

function clearSelectedBusiness() {

    selectedBusiness =
        null;


    const input =
        document.getElementById(
            "businessQuery"
        );


    const card =
        document.getElementById(
            "selectedBusinessCard"
        );


    if (
        input
    ) {

        input.value =
            "";


        input
            .closest(
                ".place-search-wrapper"
            )
            ?.classList
            .remove(
                "hidden"
            );

    }


    if (
        card
    ) {

        card.classList.add(
            "hidden"
        );

    }


    [
        "businessPlaceId",
        "businessName",
        "businessAddress",
        "businessLat",
        "businessLon",
        "businessRating",
        "businessRatingCount",
        "businessType"
    ]
        .forEach(
            function (id) {

                setInputValue(
                    id,
                    ""
                );

            }
        );

}


/* =========================================================
   FORMATAR CATEGORIA
========================================================= */

function formatGeoapifyCategory(
    category
) {

    let value =
        category;


    if (
        Array.isArray(
            category
        )
    ) {

        value =
            category[0];

    }


    if (
        !value
    ) {

        return "";

    }


    const finalPart =
        String(
            value
        )
            .split(".")
            .pop()
            .replace(
                /_/g,
                " "
            );


    return finalPart
        .charAt(0)
        .toUpperCase() +
        finalPart.slice(1);

}


/* =========================================================
   HELPERS DA BUSCA DA EMPRESA
========================================================= */

function hideBusinessSuggestions() {

    const container =
        document.getElementById(
            "businessSuggestions"
        );


    if (
        container
    ) {

        container.classList.add(
            "hidden"
        );

    }

}


function setBusinessLoading(
    loading
) {

    const loader =
        document.getElementById(
            "businessSearchLoader"
        );


    if (
        !loader
    ) {

        return;

    }


    loader.classList.toggle(
        "hidden",
        !loading
    );

}


function renderBusinessMessage(
    message
) {

    const container =
        document.getElementById(
            "businessSuggestions"
        );


    if (
        !container
    ) {

        return;

    }


    container.innerHTML =
        "";


    const item =
        document.createElement(
            "div"
        );


    item.style.padding =
        "15px 16px";


    item.style.fontSize =
        ".72rem";


    item.style.lineHeight =
        "1.5";


    item.style.color =
        "#7d8898";


    item.textContent =
        message;


    container.appendChild(
        item
    );


    container.classList.remove(
        "hidden"
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

        console.error(
            "diagnosticForm não encontrado."
        );

        return;

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            clearErrors();


            const regionInput =
                document.getElementById(
                    "region"
                );


            const companyInput =
                document.getElementById(
                    "company"
                );


            const addressInput =
                document.getElementById(
                    "businessQuery"
                );


          const segmentInput =
    document.getElementById(
        "segment"
    );

const customSegmentInput =
    document.getElementById(
        "customSegment"
    );

const phoneInput =
    document.getElementById(
        "phone"
    );


            const region =
                regionInput
                    ?.value
                    .trim() ||
                "";


            const company =
                companyInput
                    ?.value
                    .trim() ||
                "";


            const segment =
    segmentInput
        ?.value
        .trim() ||
    "";

const customSegment =
    customSegmentInput
        ?.value
        .trim() ||
    "";

const segmentName =
    segment === "outro"
        ? customSegment
        : (
            segmentInput
                ?.options[
                    segmentInput.selectedIndex
                ]
                ?.text ||
            ""
        ).trim();


            const phone =
                (
                    phoneInput
                        ?.value ||
                    ""
                )
                    .replace(
                        /\D/g,
                        ""
                    );


            let valid =
                true;


            /*
                CIDADE
            */

            if (
                !selectedCity ||
                !selectedCity.lat ||
                !selectedCity.lon
            ) {

                showError(
                    regionInput,
                    "Selecione sua cidade nas sugestões."
                );

                valid =
                    false;

            }


            /*
                EMPRESA
            */

            if (
                !company
            ) {

                showError(
                    companyInput,
                    "Informe o nome da empresa."
                );

                valid =
                    false;

            }


            /*
                ENDEREÇO
            */

            if (
                !selectedBusiness ||
                !selectedBusiness.address ||
                selectedBusiness.lat === "" ||
                selectedBusiness.lon === ""
            ) {

                showError(
                    addressInput,
                    "Selecione o endereço correto nas sugestões."
                );

                valid =
                    false;

            }


            /*
                SEGMENTO
            */

            if (
                !segment
            ) {

                showError(
                    segmentInput,
                    "Informe o segmento."
                );

                valid =
                    false;

            }

           if (
    segment === "outro" &&
    !customSegment
) {

    showError(
        customSegmentInput,
        "Digite qual é o seu segmento."
    );

    valid =
        false;

}


            /*
                WHATSAPP
            */

            if (
                phone.length < 10
            ) {

                showError(
                    phoneInput,
                    "Informe um WhatsApp válido."
                );

                valid =
                    false;

            }


            if (
                !valid
            ) {

                document
                    .querySelector(
                        ".input-error"
                    )
                    ?.focus();


                return;

            }


            redirectToRadar({

    region,

    company,

    segment,

    segmentName,

    phone

});

        }
    );

}


/* =========================================================
   REDIRECIONAR PARA O RADAR
========================================================= */

function redirectToRadar({

    region,

    company,

    segment,

    segmentName,

    phone

}) {

    const destination =
        new URL(
            RADAR_LOCAL_URL
        );


    /* =====================================================
       DADOS PRINCIPAIS
    ====================================================== */

    destination.searchParams.set(
        "empresa",
        company
    );


    destination.searchParams.set(
        "segmento",
        segment
    );

destination.searchParams.set(
    "segmento_nome",
    segmentName
);

    destination.searchParams.set(
        "regiao",
        region
    );


    destination.searchParams.set(
        "telefone",
        phone
    );


    destination.searchParams.set(
        "origem",
        "posicionamento-local"
    );


    /* =====================================================
       CIDADE
    ====================================================== */

    destination.searchParams.set(
        "cidade",
        selectedCity.name
    );


    destination.searchParams.set(
        "estado",
        selectedCity.stateCode
    );


    destination.searchParams.set(
        "city_lat",
        selectedCity.lat
    );


    destination.searchParams.set(
        "city_lon",
        selectedCity.lon
    );


    if (
        selectedCity.placeId
    ) {

        destination.searchParams.set(
            "city_place_id",
            selectedCity.placeId
        );

    }


    /* =====================================================
       ENDEREÇO REAL
    ====================================================== */

    destination.searchParams.set(
        "endereco",
        selectedBusiness.address
    );


    destination.searchParams.set(
        "lat",
        selectedBusiness.lat
    );


    destination.searchParams.set(
        "lon",
        selectedBusiness.lon
    );


    if (
        selectedBusiness.placeId
    ) {

        destination.searchParams.set(
            "place_id",
            selectedBusiness.placeId
        );

    }


    if (
        selectedBusiness.postcode
    ) {

        destination.searchParams.set(
            "cep",
            selectedBusiness.postcode
        );

    }


    if (
        selectedBusiness.suburb
    ) {

        destination.searchParams.set(
            "bairro",
            selectedBusiness.suburb
        );

    }


    /* =====================================================
       TRACKING
    ====================================================== */

    copyTrackingParameters(
        destination
    );


    /* =====================================================
       SALVAR CONTEXTO
    ====================================================== */

    try {

        localStorage.setItem(
            "radarLocalLead",
            JSON.stringify({

                empresa:
                    company,

                segmento:
                    segment,

               segmentoNome:
    segmentName,

                telefone:
                    phone,

                regiao:
                    region,

                cidade:
                    selectedCity.name,

                estado:
                    selectedCity.stateCode,

                endereco:
                    selectedBusiness.address,

                bairro:
                    selectedBusiness.suburb ||
                    "",

                cep:
                    selectedBusiness.postcode ||
                    "",

                lat:
                    selectedBusiness.lat,

                lon:
                    selectedBusiness.lon,

                placeId:
                    selectedBusiness.placeId ||
                    "",

                cityLat:
                    selectedCity.lat,

                cityLon:
                    selectedCity.lon,

                cityPlaceId:
                    selectedCity.placeId ||
                    "",

                origem:
                    "posicionamento-local",

                timestamp:
                    new Date()
                        .toISOString()

            })
        );

    }

    catch (error) {

        console.warn(
            "Não foi possível salvar o contexto.",
            error
        );

    }


    /* =====================================================
       BOTÃO
    ====================================================== */

    const button =
        document.querySelector(
            "#diagnosticForm button[type='submit']"
        );


    if (
        button
    ) {

        button.disabled =
            true;


        button.innerHTML =
            `
                Preparando diagnóstico...
                <span>→</span>
            `;

    }


    /* =====================================================
       IR PARA O RADAR
    ====================================================== */

    setTimeout(
        function () {

            window.location.href =
                destination.toString();

        },
        450
    );

}


/* =========================================================
   TRACKING
========================================================= */

function copyTrackingParameters(
    destination
) {

    const current =
        new URLSearchParams(
            window.location.search
        );


    [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
        "fbclid",
        "gclid"
    ]
        .forEach(
            function (key) {

                const value =
                    current.get(
                        key
                    );


                if (
                    value
                ) {

                    destination
                        .searchParams
                        .set(
                            key,
                            value
                        );

                }

            }
        );

}
