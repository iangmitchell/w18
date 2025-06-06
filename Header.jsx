function Header({name, symbol}) {
  return (
    <>
      <div className="block">
        <section className="hero is-info">
          <div className="hero-body">
            <div className="container">
              <h1 className="title"> {name}</h1>
              <h2 className="subtitle">{symbol}</h2>
            </div>
          </div>
        </section>
      </div>
      <article className="message is-primary">
        <div className="message-body">Displays accounts and balances</div>
      </article>
    </>
  );
}
export default Header;
