const user = {
  username: "John",
  showUsername() { console.log(this.username); }
};

function show() {
  console.log(this.username);
}

user.showUsername()
show()
