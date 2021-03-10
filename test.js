const x = [{ user: "a" }, { user: "b" }, { user: "c" }, { user: "d" }, { user: "e" }, { user: "f" }, { user: "g" }];
const res = x.find(o => o.user == "f")
console.log(res)