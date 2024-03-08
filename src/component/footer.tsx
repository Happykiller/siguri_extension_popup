import * as React from 'react';
import { Link } from '@mui/material';
import { Trans } from 'react-i18next';

import '@component/footer.scss';
import { CODES } from '@src/common/codes';
import { version } from '../../package.json';
import inversify from '@src/common/inversify';
import { SystemInfoUsecaseModel } from '../usecase/system/model/systemInfo.usecase.model';

export const Footer = () => {
  const [apiVersion, setApiVersion] = React.useState(null);
  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });

  let message = '';
  if (qry.error) {
    message = `footer.${qry.error}`;
  } else if (qry.loading) {
    message = `common.loading`;
  } else if (!apiVersion) {
    setQry(qry => ({
      ...qry,
      loading: true
    }));
    inversify.systemInfoUsecase.execute()
      .then((response:{
        message: string;
        data?: {
          version: string
        };
        error?: string;
      }) => {
        if(response.message === CODES.SUCCESS) {
          setApiVersion(response.data.version);
        } else {
          setQry(qry => ({
            ...qry,
            error: response.message
          }));
        }
      })
      .catch((error:any) => {
        setQry(qry => ({
          ...qry,
          error: error.message
        }));
      })
      .finally(() => {
        setQry(qry => ({
          ...qry,
          loading: false
        }));
      });
  }

  return (
    <div className='footer'>
      <Link href="https://siguri.happykiller.net/" target="_blank">Siguri</Link> 
      &nbsp;- <Link href="mailto:fabrice.rosito@gmail.com"><Trans>footer.mail</Trans></Link> 
      &nbsp;- <Trans>footer.version.ext</Trans>{version} 
      &nbsp;- <Trans>footer.version.apis</Trans><Trans>{apiVersion}</Trans> 
      &nbsp;- <Link href="https://github.com/Happykiller/siguri_front/issues" target="_blank"><Trans>footer.issues</Trans></Link> 
      &nbsp;- <Link href="https://github.com/users/Happykiller/projects/3/views/1" target="_blank"><Trans>footer.roadmap</Trans></Link>
      &nbsp;- <Link href="https://siguri.happykiller.net/cgu" target="_blank" rel="noopener noreferrer">CGU</Link>
    </div>
  )
}