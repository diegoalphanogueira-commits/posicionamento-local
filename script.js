/* =========================================================
   POSICIONAMENTO LOCAL
   LANDING → RADAR LOCAL
   Busca inteligente com Geoapify
========================================================= */


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const GEOAPIFY_API_KEY =
    "61752d18dba9485784b870f8d4e38b17";


const RADAR_LOCAL_URL =
    "https://diegoalphanogueira-commits.github.io/radar-local/";


const AUTOCOMPLETE_DELAY =
    450;


const MIN_SEARCH_LENGTH =
    3;


/* =========================================================
   ESTADO
========================================================= */

let placeSearchTimer = null;

let placeAbortController = null;

let selectedPlace = null;


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setCurrentYear();

        setupMobileMenu();

        setupPhoneMask();

        setupPlaceAutocomplete();

        setupDiagnosticForm();

        setupSmoothMenuClose();

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

    const menuButton =
        document.getElementById(
            "menuToggle"
        );


    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );


    if (
        !menuButton ||
        !mobileMenu
    ) {

        return;

    }


    menuButton.addEventListener(
        "click",
        function () {

            const opened =
                mobileMenu.classList
                    .toggle(
                        "active"
                    );


            document.body.classList
                .toggle(
                    "menu-open",
                    opened
                );


            menuButton.setAttribute(
                "aria-expanded",
                opened
                    ? "true"
                    : "false"
            );

        }
    );

}


/* =========================================================
   FECHAR MENU AO CLICAR
========================================================= */

function setupSmoothMenuClose() {

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );


    const menuButton =
        document.getElementById(
            "menuToggle"
        );


    if (
        !mobileMenu ||
        !menuButton
    ) {

        return;

    }


    mobileMenu
        .querySelectorAll("a")
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        mobileMenu
                            .classList
                            .remove(
                                "active"
                            );


                        document.body
                            .classList
                            .remove(
                                "menu-open"
                            );


                        menuButton
                            .setAttribute(
                                "aria-expanded",
                                "false"
                            );

                    }
                );

            }
        );

}


/* =========================================================
   MÁSCARA DO WHATSAPP
========================================================= */

function setupPhoneMask() {

    const phoneInput =
        document.getElementById(
            "phone"
        );


    if (!phoneInput) {
        return;
    }


    phoneInput.addEventListener(
        "input",
        function () {

            let value =
                phoneInput
                    .value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .substring(
                        0,
                        11
                    );


            if (
                value.length >
                10
            ) {

                phoneInput.value =
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
                value.length >
                6
            ) {

                phoneInput.value =
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
                value.length >
                2
            ) {

                phoneInput.value =
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
                value.length >
                0
            ) {

                phoneInput.value =
                    "(" +
                    value;


                return;

            }


            phoneInput.value = "";

        }
    );

}


/* =========================================================
   AUTOCOMPLETE GEOAPIFY
========================================================= */

function setupPlaceAutocomplete() {

    const searchInput =
        document.getElementById(
            "placeSearch"
        );


    const suggestions =
        document.getElementById(
            "placeSuggestions"
        );


    const changeButton =
        document.getElementById(
            "changePlaceButton"
        );


    if (
        !searchInput ||
        !suggestions
    ) {

        return;

    }


    searchInput.addEventListener(
        "input",
        function () {

            const query =
                searchInput
                    .value
                    .trim();


            /*
                Se a pessoa alterar
                depois de selecionar,
                removemos a seleção.
            */

            if (selectedPlace) {

                clearSelectedPlace(
                    false
                );

            }


            clearTimeout(
                placeSearchTimer
            );


            if (
                query.length <
                MIN_SEARCH_LENGTH
            ) {

                hideSuggestions();

                setPlaceLoading(
                    false
                );

                return;

            }


            placeSearchTimer =
                setTimeout(
                    function () {

                        searchPlaces(
                            query
                        );

                    },
                    AUTOCOMPLETE_DELAY
                );

        }
    );


    if (changeButton) {

        changeButton
            .addEventListener(
                "click",
                function () {

                    clearSelectedPlace(
                        true
                    );


                    searchInput.focus();

                }
            );

    }


    /*
        Fecha ao clicar
        fora da busca.
    */

    document.addEventListener(
        "click",
        function (event) {

            const field =
                searchInput.closest(
                    ".place-search-field"
                );


            if (
                field &&
                !field.contains(
                    event.target
                )
            ) {

                hideSuggestions();

            }

        }
    );

}


/* =========================================================
   BUSCAR LOCAIS
========================================================= */

async function searchPlaces(
    query
) {

    const suggestions =
        document.getElementById(
            "placeSuggestions"
        );


    if (
        !suggestions
    ) {

        return;

    }


    if (
        !GEOAPIFY_API_KEY ||
        GEOAPIFY_API_KEY.includes(
            "COLE_SUA"
        )
    ) {

        console.error(
            "Configure sua chave do Geoapify em GEOAPIFY_API_KEY."
        );

        renderSearchMessage(
            "Busca ainda não configurada."
        );

        return;

    }


    /*
        Primeiro pegamos a cidade/região
        informada no formulário.
    */

    const regionInput =
        document.getElementById(
            "region"
        );


    const region =
        regionInput
            ?.value
            .trim() ||
        "";


    /*
        Se não houver cidade/região,
        não fazemos busca nacional.
        Pedimos primeiro a localização.
    */

    if (
        !region
    ) {

        renderSearchMessage(
            "Informe primeiro sua cidade ou região para encontrarmos resultados próximos."
        );

        setPlaceLoading(
            false
        );

        return;

    }


    /*
        Cancela uma busca anterior
        caso a pessoa continue digitando.
    */

    if (
        placeAbortController
    ) {

        placeAbortController
            .abort();

    }


    placeAbortController =
        new AbortController();


    setPlaceLoading(
        true
    );


    try {

        const url =
            new URL(
                "https://api.geoapify.com/v1/geocode/autocomplete"
            );


        /*
            A cidade/região entra como
            contexto da pesquisa.

            Exemplo:

            Rua Waldemar..., Guarulhos - SP, Brasil
        */

        const searchText =
            `${query}, ${region}, Brasil`;


        url.searchParams.set(
            "text",
            searchText
        );


        url.searchParams.set(
            "format",
            "json"
        );


        /*
            Mantém resultados somente
            dentro do Brasil.
        */

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


        console.log(
            "Buscando local:",
            searchText
        );


        const response =
            await fetch(
                url.toString(),
                {
                    signal:
                        placeAbortController
                            .signal
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


        /*
            Quando format=json,
            normalmente temos results[].

            Mantemos compatibilidade
            também com GeoJSON/features.
        */

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

                        return (
                            feature.properties ||
                            {}
                        );

                    }
                );

        }


        /*
            Priorizamos resultados
            relacionados à cidade digitada.
        */

        const normalizedRegion =
            normalizeSearchText(
                region
            );


        const sortedResults =
            [...results]
                .sort(
                    function (
                        a,
                        b
                    ) {

                        const aText =
                            normalizeSearchText(
                                [
                                    a.city,
                                    a.town,
                                    a.village,
                                    a.county,
                                    a.state,
                                    a.formatted
                                ]
                                    .filter(Boolean)
                                    .join(" ")
                            );


                        const bText =
                            normalizeSearchText(
                                [
                                    b.city,
                                    b.town,
                                    b.village,
                                    b.county,
                                    b.state,
                                    b.formatted
                                ]
                                    .filter(Boolean)
                                    .join(" ")
                            );


                        const aMatches =
                            aText.includes(
                                normalizedRegion
                            )
                                ? 1
                                : 0;


                        const bMatches =
                            bText.includes(
                                normalizedRegion
                            )
                                ? 1
                                : 0;


                        return (
                            bMatches -
                            aMatches
                        );

                    }
                );


        renderPlaceSuggestions(
            sortedResults
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
            "Erro no autocomplete:",
            error
        );


        renderSearchMessage(
            "Não foi possível buscar agora. Você ainda pode preencher os dados abaixo manualmente."
        );

    }

    finally {

        setPlaceLoading(
            false
        );

    }

}


/* =========================================================
   NORMALIZAR TEXTO PARA COMPARAÇÃO
========================================================= */

function normalizeSearchText(
    value
) {

    return String(
        value || ""
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
   RENDERIZAR SUGESTÕES
========================================================= */

function renderPlaceSuggestions(
    results
) {

    const suggestions =
        document.getElementById(
            "placeSuggestions"
        );


    if (
        !suggestions
    ) {

        return;

    }


    suggestions.innerHTML =
        "";


    if (
        !results.length
    ) {

        renderSearchMessage(
            "Nenhum local encontrado. Tente o endereço completo ou continue preenchendo manualmente."
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


            title.textContent =
                getPlaceTitle(
                    place
                );


            const address =
                document.createElement(
                    "span"
                );


            address.textContent =
                getPlaceAddress(
                    place
                );


            copy.appendChild(
                title
            );


            copy.appendChild(
                address
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

                    selectPlace(
                        place
                    );

                }
            );


            suggestions.appendChild(
                button
            );

        }
    );


    suggestions
        .classList
        .remove(
            "hidden"
        );

}


/* =========================================================
   TEXTO DO RESULTADO
========================================================= */

function getPlaceTitle(
    place
) {

    return (
        place.name ||
        place.address_line1 ||
        place.street ||
        place.city ||
        place.formatted ||
        "Local encontrado"
    );

}


function getPlaceAddress(
    place
) {

    return (
        place.formatted ||
        [
            place.address_line1,
            place.address_line2
        ]
            .filter(Boolean)
            .join(", ") ||
        "Endereço identificado"
    );

}


/* =========================================================
   SELECIONAR LOCAL
========================================================= */

function selectPlace(
    place
) {

    const searchInput =
        document.getElementById(
            "placeSearch"
        );


    const companyInput =
        document.getElementById(
            "company"
        );


    const regionInput =
        document.getElementById(
            "region"
        );


    const selectedCard =
        document.getElementById(
            "selectedPlaceCard"
        );


    const selectedName =
        document.getElementById(
            "selectedPlaceName"
        );


    const selectedAddress =
        document.getElementById(
            "selectedPlaceAddress"
        );


    const formattedAddress =
        getPlaceAddress(
            place
        );


    const city =
        place.city ||
        place.town ||
        place.village ||
        place.county ||
        "";


    const state =
        place.state_code ||
        place.state ||
        "";


    const regionText =
        [
            city,
            state
        ]
            .filter(Boolean)
            .join(" - ");


    /*
        Alguns resultados são apenas
        rua/cidade.

        Só usamos o name como empresa
        quando parece ser um local real.
    */

    const nonBusinessTypes = [
        "street",
        "city",
        "suburb",
        "district",
        "postcode",
        "state",
        "country"
    ];


    const hasBusinessName =
        Boolean(
            place.name
        ) &&
        !nonBusinessTypes.includes(
            place.result_type
        );


    selectedPlace = {

        name:
            place.name ||
            "",

        address:
            formattedAddress,

        city,

        state,

        postcode:
            place.postcode ||
            "",

        lat:
            place.lat ??
            "",

        lon:
            place.lon ??
            "",

        placeId:
            place.place_id ||
            "",

        resultType:
            place.result_type ||
            ""

    };


    /*
        Campo visual de busca
    */

    if (
        searchInput
    ) {

        searchInput.value =
            hasBusinessName

                ? place.name

                : (
                    place.address_line1 ||
                    formattedAddress
                );

    }


    /*
        Preenche nome da empresa
        se o Geoapify identificou
        um estabelecimento.
    */

    if (
        companyInput &&
        hasBusinessName
    ) {

        companyInput.value =
            place.name;

    }


    /*
        Preenche cidade/região.
    */

    if (
        regionInput &&
        regionText
    ) {

        regionInput.value =
            regionText;

    }


    /*
        Hidden fields
    */

    setInputValue(
        "placeAddress",
        formattedAddress
    );


    setInputValue(
        "placeCity",
        city
    );


    setInputValue(
        "placeState",
        state
    );


    setInputValue(
        "placePostcode",
        place.postcode ||
        ""
    );


    setInputValue(
        "placeLat",
        place.lat ??
        ""
    );


    setInputValue(
        "placeLon",
        place.lon ??
        ""
    );


    setInputValue(
        "placeId",
        place.place_id ||
        ""
    );


    /*
        Card de confirmação
    */

    if (
        selectedName
    ) {

        selectedName.textContent =
            hasBusinessName
                ? place.name
                : (
                    companyInput?.value ||
                    "Local selecionado"
                );

    }


    if (
        selectedAddress
    ) {

        selectedAddress.textContent =
            formattedAddress;

    }


    if (
        selectedCard
    ) {

        selectedCard
            .classList
            .remove(
                "hidden"
            );

    }


    hideSuggestions();

}


/* =========================================================
   LIMPAR LOCAL
========================================================= */

function clearSelectedPlace(
    clearSearchInput
) {

    selectedPlace =
        null;


    const selectedCard =
        document.getElementById(
            "selectedPlaceCard"
        );


    if (
        selectedCard
    ) {

        selectedCard
            .classList
            .add(
                "hidden"
            );

    }


    [
        "placeAddress",
        "placeCity",
        "placeState",
        "placePostcode",
        "placeLat",
        "placeLon",
        "placeId"
    ]
        .forEach(
            function (id) {

                setInputValue(
                    id,
                    ""
                );

            }
        );


    if (
        clearSearchInput
    ) {

        const input =
            document.getElementById(
                "placeSearch"
            );


        if (input) {

            input.value =
                "";

        }

    }

}


/* =========================================================
   HELPERS DA BUSCA
========================================================= */

function setInputValue(
    id,
    value
) {

    const input =
        document.getElementById(
            id
        );


    if (input) {

        input.value =
            value;

    }

}


function hideSuggestions() {

    const suggestions =
        document.getElementById(
            "placeSuggestions"
        );


    if (
        suggestions
    ) {

        suggestions
            .classList
            .add(
                "hidden"
            );

    }

}


function setPlaceLoading(
    loading
) {

    const loader =
        document.getElementById(
            "placeSearchLoader"
        );


    if (!loader) {
        return;
    }


    loader.classList.toggle(
        "hidden",
        !loading
    );

}


function renderSearchMessage(
    message
) {

    const suggestions =
        document.getElementById(
            "placeSuggestions"
        );


    if (
        !suggestions
    ) {

        return;

    }


    suggestions.innerHTML =
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


    suggestions.appendChild(
        item
    );


    suggestions.classList
        .remove(
            "hidden"
        );

}


/* =========================================================
   ERROS DO FORMULÁRIO
========================================================= */

function clearFormErrors() {

    document
        .querySelectorAll(
            ".input-error"
        )
        .forEach(
            function (element) {

                element.classList
                    .remove(
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


function showFieldError(
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


    const container =
        input.closest(
            ".field"
        ) ||
        input.parentElement;


    if (
        container
    ) {

        container.appendChild(
            error
        );

    }

}


/* =========================================================
   FORMULÁRIO PRINCIPAL
========================================================= */

function setupDiagnosticForm() {

    const form =
        document.getElementById(
            "diagnosticForm"
        );


    if (!form) {

        console.error(
            "Formulário diagnosticForm não encontrado."
        );

        return;

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            clearFormErrors();


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


            const region =
                regionInput
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


            if (
                !company
            ) {

                showFieldError(
                    companyInput,
                    "Informe o nome da empresa."
                );

                valid =
                    false;

            }


            if (
                !segment
            ) {

                showFieldError(
                    segmentInput,
                    "Selecione o segmento."
                );

                valid =
                    false;

            }


            if (
                !region
            ) {

                showFieldError(
                    regionInput,
                    "Informe sua cidade ou região."
                );

                valid =
                    false;

            }


            if (
                phone.length <
                10
            ) {

                showFieldError(
                    phoneInput,
                    "Informe um WhatsApp válido."
                );

                valid =
                    false;

            }


            if (
                !valid
            ) {

                const firstError =
                    document.querySelector(
                        ".input-error"
                    );


                firstError
                    ?.focus();


                return;

            }


            redirectToRadar({

                company,

                segment,

                region,

                phone

            });

        }
    );

}


/* =========================================================
   REDIRECIONAR PARA RADAR
========================================================= */

function redirectToRadar({
    company,
    segment,
    region,
    phone
}) {

    const form =
        document.getElementById(
            "diagnosticForm"
        );


    const button =
        form?.querySelector(
            'button[type="submit"]'
        );


    const originalButtonHTML =
        button?.innerHTML ||
        "";


    if (
        button
    ) {

        button.disabled =
            true;


        button.innerHTML =
            `
                <span>
                    Preparando sua análise...
                </span>
            `;

    }


    const address =
        document
            .getElementById(
                "placeAddress"
            )
            ?.value
            .trim() ||
        "";


    const city =
        document
            .getElementById(
                "placeCity"
            )
            ?.value
            .trim() ||
        "";


    const state =
        document
            .getElementById(
                "placeState"
            )
            ?.value
            .trim() ||
        "";


    const postcode =
        document
            .getElementById(
                "placePostcode"
            )
            ?.value
            .trim() ||
        "";


    const lat =
        document
            .getElementById(
                "placeLat"
            )
            ?.value ||
        "";


    const lon =
        document
            .getElementById(
                "placeLon"
            )
            ?.value ||
        "";


    const placeId =
        document
            .getElementById(
                "placeId"
            )
            ?.value ||
        "";


    /*
        Salva localmente antes
        do redirecionamento.
    */

    const leadData = {

        empresa:
            company,

        segmento:
            segment,

        regiao:
            region,

        telefone:
            phone,

        endereco:
            address,

        cidade:
            city,

        estado:
            state,

        cep:
            postcode,

        lat,

        lon,

        placeId,

        origem:
            "posicionamento-local",

        timestamp:
            new Date()
                .toISOString()

    };


    try {

        localStorage.setItem(
            "radarLocalLead",
            JSON.stringify(
                leadData
            )
        );

    }

    catch (error) {

        console.warn(
            "Não foi possível salvar o lead localmente.",
            error
        );

    }


    /*
        Monta URL do Radar.
    */

    const destination =
        new URL(
            RADAR_LOCAL_URL
        );


    destination.searchParams.set(
        "empresa",
        company
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


    /*
        Só envia dados estruturados
        se o local foi selecionado.
    */

    if (
        address
    ) {

        destination.searchParams.set(
            "endereco",
            address
        );

    }


    if (
        city
    ) {

        destination.searchParams.set(
            "cidade",
            city
        );

    }


    if (
        state
    ) {

        destination.searchParams.set(
            "estado",
            state
        );

    }


    if (
        postcode
    ) {

        destination.searchParams.set(
            "cep",
            postcode
        );

    }


    if (
        lat
    ) {

        destination.searchParams.set(
            "lat",
            lat
        );

    }


    if (
        lon
    ) {

        destination.searchParams.set(
            "lon",
            lon
        );

    }


    if (
        placeId
    ) {

        destination.searchParams.set(
            "place_id",
            placeId
        );

    }


    copyTrackingParameters(
        destination
    );


    setTimeout(
        function () {

            window.location.href =
                destination.toString();

        },
        500
    );


    /*
        Segurança caso o browser
        bloqueie a navegação.
    */

    setTimeout(
        function () {

            if (
                button
            ) {

                button.disabled =
                    false;


                button.innerHTML =
                    originalButtonHTML;

            }

        },
        5000
    );

}


/* =========================================================
   UTM / TRACKING
========================================================= */

function copyTrackingParameters(
    destination
) {

    const currentParams =
        new URLSearchParams(
            window.location.search
        );


    const parameters = [

        "utm_source",

        "utm_medium",

        "utm_campaign",

        "utm_content",

        "utm_term",

        "fbclid",

        "gclid"

    ];


    parameters.forEach(
        function (parameter) {

            const value =
                currentParams.get(
                    parameter
                );


            if (
                value
            ) {

                destination
                    .searchParams
                    .set(
                        parameter,
                        value
                    );

            }

        }
    );

}
