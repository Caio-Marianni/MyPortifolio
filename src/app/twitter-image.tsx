/* Mesmo card do Open Graph — antes eram dois arquivos idênticos de 200 linhas.
   `runtime` precisa ser literal aqui: o Next lê esse campo do arquivo, não de um re-export. */
export const runtime = "edge";

export { default, alt, size, contentType } from "./opengraph-image";
