import axios from 'axios'
import { SNARKART_REGISTER_URL } from '../../config/config.json'

class SnarkArtService {
  register ({ email, address }) {
    console.log("Registering with snark art", { email, address })
    return axios.post(SNARKART_REGISTER_URL, { email, address })
  }
}

export default new SnarkArtService()
