import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

const Interview = () => {
  return (
    <Layout>
      <PageHeader
        title="Interviews"
        subtitle="Upcoming interview schedules"
      />

      <div className="card-grid">
        <InterviewCard name="Sarah Johnson" time="10:00 AM" />
        <InterviewCard name="Robert Brown" time="2:00 PM" />
      </div>
    </Layout>
  );
};

const InterviewCard = ({ name, time }) => (
  <div className="card">
    <h3>{name}</h3>
    <h2>{time}</h2>
  </div>
);

export default Interview;
