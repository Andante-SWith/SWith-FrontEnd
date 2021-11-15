import { BrowserRouter, Switch, Route } from "react-router-dom";

import main from "../routes/main";
import auth from "../routes/auth";
import plan from "./plan/index";
import comm from "./comm/index";
import friend from "./friend/index";
import profile from "../routes/profile";
import dm from "./DM/index";
import MakeRoom from "./room/MakeRoom";
import StudyRoom from "./room/StudyRoom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={main} exact={true} />
          <Route path="/login/" component={auth} />
          <Route path="/profile/" component={profile} />
          <Route path="/plan/" component={plan} />
          <Route path="/comm/" component={comm} />
          <Route path="/friend/" component={friend} />
          <Route path="/dm" component={dm} />
          <Route path="/MakeRoom" component={MakeRoom} />
          <Route path="/StudyRoom/:studyRoomId/:nickName" component={StudyRoom} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
