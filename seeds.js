const campground = require('./models/campground')
const comment = require('./models/comments')

const data = [
	{
		name: 'Annapurna Base Camp',
		image:
			'https://images.unsplash.com/photo-1496080174650-637e3f22fa03?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b7ca353cfcc4299e6c3d431ff862e1cf&auto=format&fit=crop&w=500&q=60',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet. Pretium lectus quam id leo. Blandit cursus risus at ultrices mi tempus imperdiet nulla. In hac habitasse platea dictumst quisque sagittis purus. Nunc pulvinar sapien et ligula. Nam aliquam sem et tortor consequat. Ipsum consequat nisl vel pretium lectus. Integer feugiat scelerisque varius morbi. Tempus egestas sed sed risus pretium quam vulputate dignissim.'
	},
	{
		name: 'Goshaikunda',
		image:
			'https://images.unsplash.com/photo-1464547323744-4edd0cd0c746?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a2f853d71f43de92c4d568531aa5608f&auto=format&fit=crop&w=500&q=60',
		description:
			'Nunc vel risus commodo viverra maecenas accumsan lacus. Nunc sed blandit libero volutpat sed cras. Vitae sapien pellentesque habitant morbi tristique senectus et netus et. Felis donec et odio pellentesque diam volutpat. Lacus laoreet non curabitur gravida. Enim praesent elementum facilisis leo vel fringilla est. Elementum sagittis vitae et leo duis ut diam quam. Purus sit amet luctus venenatis lectus magna fringilla urna porttitor. Scelerisque varius morbi enim nunc faucibus a pellentesque sit amet. Ultrices sagittis orci a scelerisque purus semper eget duis at. Cras tincidunt lobortis feugiat vivamus at augue. Fermentum posuere urna nec tincidunt praesent semper feugiat. Dignissim cras tincidunt lobortis feugiat vivamus. Venenatis tellus in metus vulputate eu scelerisque.'
	},
	{
		name: 'Khaptad National Reserve',
		image:
			'https://images.unsplash.com/photo-1500367215255-0e0b25b396af?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=193a2a1fa9c7ee1a2d4db00f22e41552&auto=format&fit=crop&w=500&q=60',
		description:
			'Nunc vel risus commodo viverra maecenas accumsan lacus. Nunc sed blandit libero volutpat sed cras. Vitae sapien pellentesque habitant morbi tristique senectus et netus et. Felis donec et odio pellentesque diam volutpat. Lacus laoreet non curabitur gravida. Enim praesent elementum facilisis leo vel fringilla est. Elementum sagittis vitae et leo duis ut diam quam. Purus sit amet luctus venenatis lectus magna fringilla urna porttitor. Scelerisque varius morbi enim nunc faucibus a pellentesque sit amet. Ultrices sagittis orci a scelerisque purus semper eget duis at. Cras tincidunt lobortis feugiat vivamus at augue. Fermentum posuere urna nec tincidunt praesent semper feugiat. Dignissim cras tincidunt lobortis feugiat vivamus. Venenatis tellus in metus vulputate eu scelerisque.'
	}
]

function seedDB() {
	// remove all campgrounds
	campground.remove({}, function(err) {
		if (err) {
			console.log(err)
		} else {
			console.log('campgrounds removed!!!')
			// add new campgrounds
			data.forEach(function(seedData) {
				campground.create(seedData, function(err, campgroundData) {
					if (err) {
						console.log(err)
					} else {
						console.log('Campground added')
						// create comments
						comment.create(
							{
								text: 'This is new comment for the post',
								author: 'Phalano'
							},
							function(err, createComment) {
								if (err) {
									console.log(err)
								} else {
									campgroundData.comments.push(createComment)
									campgroundData.save()
									console.log('New comment creted!!!')
								}
							}
						)
					}
				})
			})
		}
	})
}

module.exports = seedDB
