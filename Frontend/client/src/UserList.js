import React, { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch('/v1/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
