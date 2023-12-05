declare var FB: any; // Khai báo FB cho TypeScript

class FacebookService {

    public static initialize() {
        window.fbAsyncInit = function() {
            FB.init({
                appId      : 'YOUR_APP_ID',
                cookie     : true,
                xfbml      : true,
                version    : 'v12.0'
            });

            // Thêm bất kỳ mã khởi tạo nào khác ở đây
        };
    }

    public static shareImage(imageUrl: string) {
        FB.ui({
            method: 'share',
            href: imageUrl,
        }, function(response: any) {
            if (response && !response.error_message) {
                console.log('Image shared successfully');
            } else {
                console.error('Error sharing image:', response.error_message);
            }
        });
    }
}

// Khởi tạo Facebook SDK