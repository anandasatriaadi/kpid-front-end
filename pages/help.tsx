import { ReactElement } from 'react';
import Layout from '../components/Layout';
import { NextPageWithLayout } from './_app';

const HelpPage: NextPageWithLayout = () => {
  return (
    <div>HelpPage</div>
  )
}

export default HelpPage;

HelpPage.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
  };