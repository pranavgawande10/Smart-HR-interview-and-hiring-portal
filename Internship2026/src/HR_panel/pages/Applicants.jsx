import PageHeader from "../components/PageHeader";

const Applicants = () => {
  return (
    <>
      <PageHeader
        title="Applicants"
        subtitle="Track candidate applications"
      />

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sarah Johnson</td>
              <td>Frontend Developer</td>
              <td>
                <span className="badge active">Interview</span>
              </td>
            </tr>
            <tr>
              <td>Michael Chen</td>
              <td>Product Manager</td>
              <td>
                <span className="badge pending">Pending</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Applicants;
