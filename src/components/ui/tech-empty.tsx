import TechContainer from "./tech-container";

export default function TechEmpty() {
  return (
    <div className="w-13 h-10 opacity-40">
      <TechContainer>
        <div className="w-5 h-5 text-[#fff] drop-shadow-[0_0_8px_#ffee00]"/>
      </TechContainer>
    </div>
  );
}
