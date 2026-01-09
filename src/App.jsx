import Top from "./components/Top";
import LeftPanel from "./components/LeftPanel";
import OutputPanel from "./components/OutputPanel";

function App() {
  return (
    <>
      <Top />

      <section>
        <div>
          <LeftPanel />
        </div>

        <div>
          <OutputPanel />
        </div>
      </section>
    </>
  );
}

export default App;
