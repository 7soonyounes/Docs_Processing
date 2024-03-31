import React from 'react';

import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';

function Asidebar() {
    return (
      <>
        <Navigation
            activeItemId="/management/members"
            onSelect={({itemId}) => {
            }}
            items={[
              {
                title: 'Upload Image',
                itemId: '/UploadImage',
              },
              {
                title: 'Select Template',
                itemId: '/SelectTemplate',
                subNav: [
                  {
                    title: 'Attestation RIB',
                    itemId: '/SelectTemplate/attestationRIB',
                  },
                  {
                    title: 'Fiche Exemple',
                    itemId: '/SelectTemplate/ficheExemple',
                  },
                ],
              },
              {
                title: 'Process Image',
                itemId: '/ProcessImage',
              },
              {
                title: 'Add Template',
                itemId: '/AddTemplate',
              },
            ]}
          />
      </>
    );
}
export default Asidebar;