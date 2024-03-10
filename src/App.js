import { useState } from "react";

const initialFriends = [
  { id: 1, name: "Rash", img: "https://i.pravatar.cc/100?img=1", balance: 0 },
  { id: 2, name: "Lal", img: "https://i.pravatar.cc/100?img=2", balance: -8 },
  { id: 3, name: "Sabin", img: "https://i.pravatar.cc/100?img=3", balance: 30 },
];

function Button({ children, onClick }) {
  return <button onClick={onClick}> {children} </button>;
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  // console.log(friends);

  function handleSetFrinds(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend(friend);
  }

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleSubmitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="wrapper">
      <div className="left">
        <FriendsList
          friends={friends}
          onhandleSelectedFriend={handleSelectedFriend}
        />
        <div className="button-wrapper">
          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? "Close" : "Add Friend"} 🅰️
          </Button>
        </div>
        {showAddFriend && <AddFriend onHandleSetFrinds={handleSetFrinds} />}
      </div>
      {selectedFriend && (
        <div className="right">
          <SplitBill
            OnHandleSubmitBill={handleSubmitBill}
            selectedFriend={selectedFriend}
          />
        </div>
      )}
    </div>
  );
}

function FriendsList({ friends, onhandleSelectedFriend }) {
  return (
    <div className="friends">
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onhandleSelectedFriend={onhandleSelectedFriend}
        />
      ))}
    </div>
  );
}

function Friend({ friend, onhandleSelectedFriend }) {
  return (
    <div className="flex">
      <img src={friend.img} alt={friend.name} />
      <div>
        <h2>{friend.name}</h2>
        <h4>
          {friend.balance > 1 && `${friend.name} owes you $${friend.balance}`}
          {friend.balance === 0 &&
            `${friend.name} and you are nothing to share each other`}
          {friend.balance < 0 &&
            `You owes ${friend.name} $${Math.abs(friend.balance)}`}
        </h4>
        <Button onClick={() => onhandleSelectedFriend(friend)}>
          Select 🆗
        </Button>
      </div>
    </div>
  );
}

function AddFriend({ onHandleSetFrinds }) {
  const imgPath = "https://i.pravatar.cc/100?img=";
  const [name, setName] = useState("");
  const [image, setImage] = useState(imgPath);

  function submitAddFrind(e) {
    e.preventDefault();
    if (!name || !image) return;
    const ids = crypto.randomUUID();
    const newFriend = { id: ids, name, img: `${image}${ids}` };
    onHandleSetFrinds(newFriend);
    console.log(newFriend);
    setName("");
    setImage(imgPath);
  }

  return (
    <div className="bg-light mt-15">
      <form onSubmit={submitAddFrind}>
        <div className="form-elem">
          <label>Friend Name 🙆‍♂️</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            autoFocus
          />
        </div>
        <div className="form-elem">
          <label>Image URL 🖼️</label>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            type="text"
          />
        </div>
        <div className="button-wrapper">
          <Button>Add 👦</Button>
        </div>
      </form>
    </div>
  );
}

function SplitBill({ selectedFriend, OnHandleSubmitBill }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const friendExpense = myExpense > bill ? 0 : bill - myExpense;
  const [whoIsPaying, setWhoIsPaying] = useState("you");
  function finalSplitBill(e) {
    e.preventDefault();
    if (!bill | !friendExpense) return;
    let theAmount = 0;
    if (
      whoIsPaying === "you"
        ? (theAmount = friendExpense)
        : (theAmount = -myExpense)
    );
    OnHandleSubmitBill(theAmount);
  }
  return (
    <div className="bg-light">
      <h2> Split Bill with {selectedFriend.name}</h2>
      <form onSubmit={finalSplitBill}>
        <div className="form-elem">
          <label>Bill Value 💸</label>
          <input
            type="text"
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
          />
        </div>
        <div className="form-elem">
          <label>Your Expense 🙎‍♂️</label>
          <input
            type="text"
            value={myExpense}
            onChange={(e) =>
              setMyExpense(
                Number(e.target.value > bill ? bill : e.target.value)
              )
            }
          />
        </div>
        <div className="form-elem">
          <label>{selectedFriend.name}'s Expense 👨‍🦰</label>
          <input type="text" value={friendExpense} disabled />
        </div>
        <div className="form-elem">
          <label>Who is paying Bill 💰</label>
          <select
            value={whoIsPaying}
            onChange={(e) => setWhoIsPaying(e.target.value)}
          >
            <option value="you">You</option>
            <option value="friend">{selectedFriend.name}</option>
          </select>
        </div>
        <div className="button-wrapper">
          <Button>Split Bill ✂️</Button>
        </div>
      </form>
    </div>
  );
}
