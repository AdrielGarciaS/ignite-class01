import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCan } from "../hooks/useCan";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useAuth();

  const userCanSeeMetrics = useCan({ permissions: ['metrics.list'] })

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

      {userCanSeeMetrics && <div>Metricas</div>}
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