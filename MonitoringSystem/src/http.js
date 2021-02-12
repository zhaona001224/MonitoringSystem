/**
 * Created by superman on 17/2/16.
 * http配置
 */

import axios from 'axios'
import store from './store/store'
import * as types from './store/types'

const service = axios.create({
  baseURL: store.state.isUrl
});

export default service
