import { createLibConfig } from '@nextcloud/vite-config'
import { resolve } from 'node:path'

export default createLibConfig(
	{
		index: resolve(import.meta.dirname, 'src/index.js'),
	},
	{
		thirdPartyLicense: false,
		config: {
			test: {
				environment: 'jsdom',
			},
		},
	},
)
