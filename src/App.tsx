import Header from "@components/layout/Header/header";
import ProjectCard from "@components/ui/projectCard/projectCard";
import "@styles/mainPage.css";

function App() {
  return(
    <>
      <Header />
      <section className="ProjectSection">
        <ProjectCard title="BCHub" description="Local-first dashboard for tracking every repo you're juggling, with quick access to branches, open tasks, and recent commits." />
        <ProjectCard title="nebula-api" description="GraphQL gateway that stitches together the auth, billing, and notification microservices behind a single schema." />
        <ProjectCard title="pixel-forge" description="A lightweight canvas-based sprite editor for indie game devs, supporting layers, onion skinning, and palette locking." />
        <ProjectCard title="quietframe" description="Minimalist Markdown note-taking app with vim keybindings, local sync, and zero telemetry by design." />
        <ProjectCard title="hydra-cli" description="Command-line tool for spinning up disposable dev environments from a single YAML manifest." />
        <ProjectCard title="lumen-charts" description="A charting library focused on accessible color palettes and smooth animations for React dashboards." />
      </section>
    </>
  )
}

export default App;
