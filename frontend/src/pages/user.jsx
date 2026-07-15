import data from "./data.js";

function User() {
  return (
    <section className="user-page">
      <table className="user-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((val, index) => {
            return (
              <tr key={`${val.email}-${index}`}>
                <td>
                  <img src={val.avatar} alt="" />
                </td>
                <td>{val.id}</td>
                <td>{val.firstName}</td>
                <td>{val.lastName}</td>
                <td>{val.email}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default User;
