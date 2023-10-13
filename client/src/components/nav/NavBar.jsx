import Items from "./Items";

function NavBar() {
  return (
    <>
      <nav>
        <div>
          <img src="" id="logo" />
        </div>

        <ul>
          <Items/>
        </ul>

        <div>
          <button id = "login-btn">Login in</button>
          <button id="signup-btn">Sign up</button>
        </div>
      </nav>
    </>
  )
}

export default NavBar