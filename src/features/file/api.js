import axiosInstance from '../../lib/axiosInstance'

export const uploadImage = (file) => {
  const formData = new FormData()
  formData.append('image', file)
  return axiosInstance.post('/file-uploader/image/', formData)
}
