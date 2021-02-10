
//let hostApiUrl = 'https://noltik-api-main-ey47zdfuufjxiw.herokuapp.com/noltik_api/v1/';
let hostApiUrl = 'http://localhost:8080/noltik_api/v1/';
export const ApiUrl = hostApiUrl;

//Imagen que muestra en caso de que no exista un logo del laboratorio
let logo = "data:image/png;base64,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";

export const logoGen = logo;