import BeanstackProfile from "./BeanstackProfile";
import { PrototypeNav } from "../PrototypeNav";

export default function App() {
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <BeanstackProfile />
      </div>
      <PrototypeNav currentHref="/bs-prototypes/student-profile/" />
    </div>
  );
}
