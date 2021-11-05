import { BrowserRouter, Switch, Route } from "react-router-dom";

import main from "./main/index";
import room from "./room/index";
import auth from "./login/index";
import plan from "./plan/index";
import comm from "./comm/index";
import friend from "./friend/index";
import profile from "./profile/index";
import UserProfile from "./UserProfile/index";

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={main} exact={true} />
          <Route path="/login/" component={auth} />
          <Route path="/profile/" component={profile} />
          <Route path="/mk_room/" component={room} />
          <Route path="/plan/" component={plan} />
          <Route path="/comm/" component={comm} />
          <Route path="/friend/" component={friend} />
          {/* 테스트 */}
          <Route path="/UserProfile/" component={UserProfile} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
