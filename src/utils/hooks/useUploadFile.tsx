import { FlashMessageComponent } from '../../component/FlashMessageComponent/FlashMessageComponent';
import useApi from 'src/axios/useApi';
import { EndPoint } from 'src/ApiManager/config';
import React from 'react';
import axios from 'axios';

export const useUploadFile = () => {
    const { apiRequest, loading } = useApi();
    const [response, setResponse] = React.useState<any>(null);
    const uploadFileHook = async (fileName: string, size: string, type: string, formData: any) => {
        try {
            const params = {
                "contentType": type == 'pdf' ? 'application/pdf' : 'image/jpeg',
                "extension": fileName,
                "path": `announcement`,
                "size": size
            }
            console.log("Sayyed useUploadFile:", params)
            const response: any = await apiRequest('post', EndPoint.generate_upload_url, params, null, {
                'Content-Type': 'application/json',
            });
            console.log('response', response);
            console.log('formData', formData);
            if (response.success) {
                // const s3Response = await fetch(response?.data?.pathFileUrl, {
                //     method: 'PUT',
                //     headers: {
                //         'Content-Type': 'image/jpeg',
                //     },
                //     body: await fetch(formData).then(res => res.blob()), // Convert file to blob
                // });
                // if (s3Response.ok) {
                //     console.log('Upload success:', response);
                //     return response;
                // } else {
                //     throw new Error(`Upload failed with status: ${s3Response.status}`);
                // }
                const pathResponse = await fetch(response?.data?.pathFileUrl, {
                    method: 'PUT',
                    body: formData,
                    // headers: {
                    //     'Content-Type': 'multipart/form-data',
                    // },
                });
                // const pathResponse = await fetch(response?.data?.pathFileUrl, {
                //     method: "PUT",
                //     body: formData,
                //   });
                // const pathResponse = await axios.put(response?.data?.pathFileUrl, formData);
                console.log('pathResponse', pathResponse);
                if (pathResponse.status == 200) {
                    setResponse(response)
                    return response
                } else {
                    FlashMessageComponent.show(
                        'error',
                        'Something went wrong, please try again!',
                    );
                }
            } else {
                FlashMessageComponent.show(
                    'error',
                    'Something went wrong, please try again!',
                );
            }
        } catch (error) {
            FlashMessageComponent.show(
                'error',
                'Something went wrong, please try again!',
            );
            console.error('Error:', error);
        }
    };

    return { uploadFileHook, response };
};

