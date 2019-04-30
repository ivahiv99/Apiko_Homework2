import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isloaded: false,
      data: [],
      counter: 10,
      searchResult: null
    };
    this.RenderMore = this.RenderMore.bind(this);
    this.Search = this.Search.bind(this);
    this.backBtn = this.backBtn.bind(this);
  }

  RenderMore() {
    this.setState({
      counter: this.state.counter + 10
    });
  }

  Search() {
    const req = document.getElementById("searchInput").value;
    const data = this.state.data.filter(item => {
      return item.title.includes(req);
    });
    this.setState({
      searchResult: data
    });
  }
  backBtn() {
    document.getElementById("searchInput").value = "";
    this.setState({
      searchResult: null
    });
  }
  render() {
    return (
      <div className="App">
        <div>
          <Search search={this.Search} />
          <MoreButton
            renderMore={this.RenderMore}
            shouldGoBack={this.state.searchResult}
            goBack={this.backBtn}
          />
        </div>
        <PostList
          isloaded={this.state.isloaded}
          data={
            this.state.searchResult ||
            this.state.data.slice(0, this.state.counter)
          }
        />
      </div>
    );
  }

  async componentDidMount() {
    await fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response => response.json())
      .then(response => {
        this.setState({
          isloaded: true,
          data: response
        });
      });
  }
}

export default App;

const MoreButton = ({ renderMore, shouldGoBack, goBack }) => {
  return shouldGoBack ? (
    <button onClick={goBack}>Back</button>
  ) : (
    <button onClick={renderMore}>More Posts</button>
  );
};

const PostList = ({ isloaded, data }) => {
  return isloaded ? (
    <ul>
      {data.map(item => (
        <PostListItem key={item.id} title={item.title} body={item.body} />
      ))}
    </ul>
  ) : (
    <h1>Loading...</h1>
  );
};

const PostListItem = ({ title, body }) => (
  <li>
    <h2>{title}</h2>
    <p>{body}</p>
  </li>
);

const Search = ({ search }) => {
  return (
    <>
      <input type="text" id={"searchInput"} />
      <button onClick={search}>search</button>
    </>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
