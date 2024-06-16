import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import url from '../../../../url';
import useAxios from '../../../../hooks/useAxios';
import ModuleAccordion from '../../../components/User/ModuleAccordion';

const Tasks = () => {
  const auth = useAuthUser();
  const { data, isPending } = useAxios(
    url + 'custom/modules_tasks/' + auth.userID
  );

  return (
    !isPending &&
    data.length &&
    data.map((module, i) => {
      return (
        <ModuleAccordion key={i} title={module.m_nos} tasks={module.uzdevumi} />
      );
    })
  );
};

export default Tasks;
