import { ProjectsView } from "@/components/projects/projects-view";
import { getReviews } from "@/services/reviews";

/* Mesmo compasso da página de avaliações: publicar passa pela moderação, não pelo minuto. */
export const revalidate = 300;

export default async function ProjectsPage() {
  /* A lista inteira e a filtragem no componente: são poucas avaliações e nenhuma carrega
     imagem: o que vem do banco é `photo` como booleano e `shots` como contagem. */
  return <ProjectsView reviews={await getReviews()} />;
}
