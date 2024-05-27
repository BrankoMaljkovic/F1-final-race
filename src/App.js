import Driver from "./components/Driver";
import Drivers from "./components/Drivers";
import Teams from "./components/Teams";
import Team from "./components/Team";


function App() {
  return (
    <div className="App">
      <h1>Marko</h1>
      <Driver />

      <h1>Sabo</h1>
      <Drivers />

      <h1>Kaca</h1>
      <Teams />

      <h1>Branko</h1>
      <Team />

    </div>
  );
}

export default App;
