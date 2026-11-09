/* Chave da intro no sessionStorage, num arquivo sem React: a page (componente de servidor) a usa
   no script inline e o hook use-intro (cliente) também — importar o hook direto na page o Next
   recusa, porque ele usa useEffect. */
export const INTRO_KEY = "estilo-b-intro";
