import { useEffect } from "react";
import { Can } from "../components/Can";
import { useAuth } from "../context/AuthContext";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    api.get('/me')
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    })
  }, [])

  return (
    <>
      <h1>Dashboard {user?.email}</h1>

      <Can permissions={['metrics.list']}>
        <div>Metricas</div>
      </Can>
    </>
  )
};

export const getServerSideProps = withSSRAuth(async (context) => {
  const apiClient = setupAPIClient(context);
  const response = await apiClient.get('/me');
  
  return {
    props: {}
  }
})