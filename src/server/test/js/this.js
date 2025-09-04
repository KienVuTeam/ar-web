const obj = {
  name: "Kien",
  greet: () => {
    console.log("Hi " + this.name); // this ở đây không phải obj
  }
};


