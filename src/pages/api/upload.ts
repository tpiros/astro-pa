import type { APIRoute } from 'astro';
import cloudinary from '../../../utils/cloudinary';
import type { UploadApiResponse } from 'cloudinary';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('image') as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result: UploadApiResponse = await new Promise((resolve, reject) => {
    console.log(import.meta.env.CLOUDINARY_TAG);
    cloudinary.uploader
      .upload_stream(
        {
          tags: [import.meta.env.CLOUDINARY_TAG],
        },
        function (error, result) {
          if (error || !result) {
            reject(error);
            return;
          }
          resolve(result);
        }
      )
      .end(buffer);
  });

  const { public_id } = result;
  console.log({ result });

  return new Response(JSON.stringify({ public_id }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
