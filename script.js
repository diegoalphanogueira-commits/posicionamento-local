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
   GOOGLE PLACES - EMPRESA
========================================================= */

let businessSearchTimer = null;

let selectedBusiness = null;

let businessSessionToken = null;

let placesAutocompleteSuggestion = null;

let placesAutocompleteSessionToken = null;

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
   GOOGLE PLACES
========================================================= */

async function setupGooglePlaces() {

    const input =
        document.getElementById(
            "businessQuery"
        );


    const suggestionsContainer =
        document.getElementById(
            "businessSuggestions"
        );


    if (
        !input ||
        !suggestionsContainer
    ) {

        return;

    }


    try {

        const placesLibrary =
            await google.maps.importLibrary(
                "places"
            );


        placesAutocompleteSuggestion =
            placesLibrary.AutocompleteSuggestion;


        placesAutocompleteSessionToken =
            placesLibrary.AutocompleteSessionToken;


        createBusinessSessionToken();


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

                    return;

                }


                businessSearchTimer =
                    setTimeout(
                        function () {

                            searchBusinesses(
                                query
                            );

                        },
                        350
                    );

            }
        );


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

    catch (error) {

        console.error(
            "Erro ao iniciar Google Places:",
            error
        );

    }

}


/* =========================================================
   SESSION TOKEN
========================================================= */

function createBusinessSessionToken() {

    if (
        placesAutocompleteSessionToken
    ) {

        businessSessionToken =
            new placesAutocompleteSessionToken();

    }

}


/* =========================================================
   BUSCAR EMPRESAS
========================================================= */

async function searchBusinesses(
    query
) {

    if (
        !placesAutocompleteSuggestion
    ) {

        return;

    }


    if (
        !selectedCity
    ) {

        renderBusinessMessage(
            "Selecione primeiro a cidade."
        );

        return;

    }


    setBusinessLoading(
        true
    );


    try {

        const request = {

            input:
                query,

            includedRegionCodes:
                [
                    "br"
                ],

            language:
                "pt-BR",

            sessionToken:
                businessSessionToken

        };


        /*
            Usa a cidade selecionada
            para priorizar resultados próximos.
        */

        if (
            selectedCity.lat &&
            selectedCity.lon
        ) {

            request.locationBias = {

                center: {

                    lat:
                        Number(
                            selectedCity.lat
                        ),

                    lng:
                        Number(
                            selectedCity.lon
                        )

                },

                radius:
                    40000

            };

        }


        const response =
            await placesAutocompleteSuggestion
                .fetchAutocompleteSuggestions(
                    request
                );


        const suggestions =
            response.suggestions ||
            [];


        console.log(
            "Google Places sugestões:",
            suggestions
        );


        renderBusinessSuggestions(
            suggestions
        );

    }

    catch (error) {

        console.error(
            "Erro ao buscar empresas:",
            error
        );


        renderBusinessMessage(
            "Não foi possível buscar estabelecimentos agora."
        );

    }

    finally {

        setBusinessLoading(
            false
        );

    }

}


/* =========================================================
   RENDERIZAR EMPRESAS
========================================================= */

function renderBusinessSuggestions(
    suggestions
) {

    const container =
        document.getElementById(
            "businessSuggestions"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    const validSuggestions =
        suggestions.filter(
            function (suggestion) {

                return Boolean(
                    suggestion.placePrediction
                );

            }
        );


    if (
        !validSuggestions.length
    ) {

        renderBusinessMessage(
            "Nenhum estabelecimento encontrado."
        );

        return;

    }


    validSuggestions
        .slice(
            0,
            5
        )
        .forEach(
            function (suggestion) {

                const prediction =
                    suggestion.placePrediction;


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
                    prediction
                        .mainText
                        ?.text ||
                    prediction.text?.text ||
                    "Estabelecimento";


                const subtitle =
                    document.createElement(
                        "span"
                    );


                subtitle.textContent =
                    prediction
                        .secondaryText
                        ?.text ||
                    "";


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

                        selectBusiness(
                            prediction
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
   SELECIONAR EMPRESA
========================================================= */

async function selectBusiness(
    prediction
) {

    setBusinessLoading(
        true
    );


    try {

        const place =
            prediction.toPlace();


        await place.fetchFields({

            fields: [

                "id",

                "displayName",

                "formattedAddress",

                "location",

                "rating",

                "userRatingCount",

                "primaryTypeDisplayName"

            ]

        });


        const lat =
            place.location
                ? place.location.lat()
                : "";


        const lon =
            place.location
                ? place.location.lng()
                : "";


        selectedBusiness = {

            placeId:
                place.id ||
                "",

            name:
                place.displayName ||
                "",

            address:
                place.formattedAddress ||
                "",

            lat,

            lon,

            rating:
                place.rating ??
                "",

            ratingCount:
                place.userRatingCount ??
                "",

            type:
                place.primaryTypeDisplayName ||
                ""

        };


        fillBusinessFields();


        renderSelectedBusiness();


        hideBusinessSuggestions();


        /*
            Nova sessão para próxima busca.
        */

        createBusinessSessionToken();

    }

    catch (error) {

        console.error(
            "Erro ao carregar estabelecimento:",
            error
        );


        renderBusinessMessage(
            "Não foi possível carregar os dados deste estabelecimento."
        );

    }

    finally {

        setBusinessLoading(
            false
        );

    }

}


/* =========================================================
   PREENCHER DADOS
========================================================= */

function fillBusinessFields() {

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


    setInputValue(
        "businessRating",
        selectedBusiness.rating
    );


    setInputValue(
        "businessRatingCount",
        selectedBusiness.ratingCount
    );


    setInputValue(
        "businessType",
        selectedBusiness.type
    );


    /*
        Preenche segmento automaticamente
        quando o Google retornar categoria.
    */

    const segmentInput =
        document.getElementById(
            "segment"
        );


    if (
        segmentInput &&
        selectedBusiness.type &&
        !segmentInput.value.trim()
    ) {

        segmentInput.value =
            selectedBusiness.type;

    }

}


/* =========================================================
   CARD DA EMPRESA
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
            selectedBusiness.address;

    }


    if (
        meta
    ) {

        const parts =
            [];


        if (
            selectedBusiness.rating
        ) {

            parts.push(
                `★ ${selectedBusiness.rating}`
            );

        }


        if (
            selectedBusiness.ratingCount !== ""
        ) {

            parts.push(
                `${selectedBusiness.ratingCount} avaliações`
            );

        }


        if (
            selectedBusiness.type
        ) {

            parts.push(
                selectedBusiness.type
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
   ALTERAR EMPRESA
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


    createBusinessSessionToken();

}


/* =========================================================
   HELPERS EMPRESA
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


    if (!loader) {
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


            const businessInput =
                document.getElementById(
                    "businessQuery"
                );


            const segmentInput =
                document.getElementById(
                    "segment"
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


            const businessQuery =
                businessInput
                    ?.value
                    .trim() ||
                "";


            const segment =
                segmentInput
                    ?.value
                    .trim() ||
                "";


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
                Obrigamos o usuário
                a selecionar uma cidade
                real do autocomplete.
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


            if (
                !businessQuery
            ) {

                showError(
                    businessInput,
                    "Informe o nome da empresa ou endereço."
                );

                valid =
                    false;

            }


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

                businessQuery,

                segment,

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

    businessQuery,

    segment,

    phone

}) {

    const destination =
        new URL(
            RADAR_LOCAL_URL
        );


    /*
        O Radar vai usar estes dados
        para fazer a busca REAL
        pelo estabelecimento.
    */

    destination.searchParams.set(
        "busca",
        businessQuery
    );


    destination.searchParams.set(
        "segmento",
        segment
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


    /*
        Mantém UTMs.
    */

    copyTrackingParameters(
        destination
    );


    /*
        Salva o contexto antes
        de sair da página.
    */

    try {

        localStorage.setItem(
            "radarLocalLead",
            JSON.stringify({

                busca:
                    businessQuery,

                segmento:
                    segment,

                regiao:
                    region,

                telefone:
                    phone,

                cidade:
                    selectedCity.name,

                estado:
                    selectedCity.stateCode,

                lat:
                    selectedCity.lat,

                lon:
                    selectedCity.lon,

                cityPlaceId:
                    selectedCity.placeId,

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
            "Não foi possível salvar o contexto local.",
            error
        );

    }


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
                Buscando sua empresa...
                <span>→</span>
            `;

    }


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
