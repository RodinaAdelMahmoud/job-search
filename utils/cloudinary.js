import { v2 as cloudinary } from 'cloudinary';

import { config } from 'dotenv';
config();
    cloudinary.config({ 
        cloud_name: 'dyzu8aid0', 
        api_key: '289313883264513', 
        api_secret: 'D1YBQU_mqsiLN0TE9tM7Q-DJz8I' // Click 'View Credentials' below to copy your API secret
    });

    export default cloudinary