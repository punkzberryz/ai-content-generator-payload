/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import React from 'react'
import {
  CreateFirstUser,
  generateMetadata as generateMeta,
} from "@payloadcms/next/pages/CreateFirstUser/index";
import { Metadata } from 'next'
import config from '@payload-config'

export const generateMetadata = async (): Promise<Metadata> => generateMeta({ config })

const Page = async () => <CreateFirstUser config={config} />;

export default Page;
