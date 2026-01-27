import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

const Profile = () => {
  return (
    <Layout>
      <PageHeader
        title="Profile"
        subtitle="HR account details"
      />

      <div className="card" style={{ maxWidth: "400px" }}>
        <h3>Name</h3>
        <h2>Alex Morgan</h2>

        <h3 style={{ marginTop: "20px" }}>Email</h3>
        <p>hr@company.com</p>
      </div>
    </Layout>
  );
};

export default Profile;
