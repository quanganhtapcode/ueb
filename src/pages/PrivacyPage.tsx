export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <a href="/login" className="text-sm text-blue-600 hover:underline">← Quay lại đăng nhập</a>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Chính sách bảo mật</h1>
          <p className="text-slate-500 text-sm">Cập nhật lần cuối: 25 tháng 3, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 dark:text-slate-300">

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">1. Giới thiệu</h2>
            <p>
              UEB Bracelet Exchange MVP ("chúng tôi", "Nền tảng") cam kết bảo vệ quyền riêng tư của người dùng. Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn khi sử dụng dịch vụ tại <strong>ueb.quanganh.org</strong>.
            </p>
            <p>
              Chúng tôi tuân thủ các quy định về bảo vệ dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP của Chính phủ Việt Nam về bảo vệ dữ liệu cá nhân.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">2. Thông tin chúng tôi thu thập</h2>
            <p><strong>2.1 Thông tin bạn cung cấp trực tiếp:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Họ tên và địa chỉ email từ tài khoản Google @vnu.edu.vn của bạn.</li>
              <li>Ảnh đại diện từ tài khoản Google (nếu có).</li>
              <li>Thông tin đăng ký trao đổi vòng tay tốt nghiệp (mô tả, trạng thái, nhu cầu).</li>
              <li>Thông tin liên hệ bạn tự nguyện chia sẻ để tiếp tục trao đổi qua chat/email sau khi ghép cặp.</li>
            </ul>
            <p className="mt-3"><strong>2.2 Thông tin thu thập tự động:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Địa chỉ IP và loại thiết bị/trình duyệt khi truy cập.</li>
              <li>Thời gian đăng nhập và các hoạt động trên Nền tảng.</li>
              <li>Dữ liệu phân tích từ Google Analytics (Firebase Analytics) bao gồm trang đã xem, thời gian sử dụng.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">3. Mục đích sử dụng thông tin</h2>
            <p>Thông tin thu thập được sử dụng cho các mục đích sau:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Xác thực danh tính:</strong> Đảm bảo chỉ thành viên ĐHQGHN mới có thể truy cập Nền tảng.</li>
              <li><strong>Vận hành dịch vụ:</strong> Hiển thị thông tin cần thiết để ghép cặp nhu cầu trao đổi vòng tay tốt nghiệp.</li>
              <li><strong>Liên lạc:</strong> Gửi thông báo về hoạt động tài khoản, cập nhật hệ thống hoặc phản hồi hỗ trợ.</li>
              <li><strong>Bảo mật:</strong> Phát hiện và ngăn chặn các hoạt động gian lận, lạm dụng hệ thống.</li>
              <li><strong>Cải thiện dịch vụ:</strong> Phân tích hành vi sử dụng để nâng cao trải nghiệm người dùng.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">4. Chia sẻ thông tin với bên thứ ba</h2>
            <p>Chúng tôi <strong>không bán</strong> thông tin cá nhân của bạn. Thông tin chỉ được chia sẻ trong các trường hợp sau:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Google / Firebase:</strong> Nền tảng sử dụng Google Firebase để xác thực đăng nhập (Firebase Authentication) và lưu trữ dữ liệu (Cloud Firestore). Google có thể xử lý dữ liệu của bạn theo <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Chính sách bảo mật của Google</a>.
              </li>
              <li>
                <strong>Người dùng khác:</strong> Một phần thông tin hồ sơ và thông tin trao đổi vòng tay có thể được hiển thị cho người dùng phù hợp trong cộng đồng ĐHQGHN để ghép cặp.
              </li>
              <li>
                <strong>Yêu cầu pháp lý:</strong> Chúng tôi có thể tiết lộ thông tin nếu được yêu cầu bởi cơ quan nhà nước có thẩm quyền theo quy định pháp luật Việt Nam.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">5. Lưu trữ và bảo mật dữ liệu</h2>
            <p>
              Dữ liệu của bạn được lưu trữ trên máy chủ Google Cloud (Firebase) với tiêu chuẩn bảo mật đạt chứng nhận ISO 27001 và SOC 2 Type II. Toàn bộ dữ liệu truyền tải giữa trình duyệt và máy chủ được mã hóa bằng giao thức HTTPS/TLS.
            </p>
            <p>
              Chúng tôi áp dụng các biện pháp kỹ thuật để hạn chế quyền truy cập vào dữ liệu cá nhân chỉ đối với những người có nhu cầu hợp lệ. Tuy nhiên, không có hệ thống nào đảm bảo bảo mật tuyệt đối và chúng tôi không thể cam kết loại trừ hoàn toàn mọi rủi ro.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">6. Thời gian lưu trữ dữ liệu</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Tài khoản hoạt động:</strong> Dữ liệu được lưu trữ trong suốt thời gian tài khoản tồn tại.</li>
              <li><strong>Sau khi xóa tài khoản:</strong> Thông tin cá nhân được xóa trong vòng 30 ngày. Dữ liệu phân tích tổng hợp (không định danh) có thể được giữ lại.</li>
              <li><strong>Dữ liệu ghép cặp và liên hệ:</strong> Lưu trữ tối đa 12 tháng kể từ ngày tạo, sau đó tự động xóa.</li>
              <li><strong>Nhật ký hệ thống:</strong> Được lưu tối đa 90 ngày cho mục đích bảo mật.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">7. Quyền của người dùng</h2>
            <p>Theo quy định pháp luật về bảo vệ dữ liệu cá nhân, bạn có các quyền sau:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Quyền truy cập:</strong> Yêu cầu xem thông tin cá nhân chúng tôi đang lưu trữ về bạn.</li>
              <li><strong>Quyền chỉnh sửa:</strong> Yêu cầu cập nhật thông tin không chính xác.</li>
              <li><strong>Quyền xóa:</strong> Yêu cầu xóa tài khoản và toàn bộ dữ liệu liên quan.</li>
              <li><strong>Quyền phản đối:</strong> Phản đối việc xử lý dữ liệu cho mục đích tiếp thị hoặc phân tích.</li>
              <li><strong>Quyền rút đồng ý:</strong> Thu hồi sự đồng ý cho phép xử lý dữ liệu bất kỳ lúc nào.</li>
            </ul>
            <p>
              Để thực hiện các quyền trên, vui lòng liên hệ: <a href="mailto:support@ueb.quanganh.org" className="text-blue-600 hover:underline">support@ueb.quanganh.org</a>. Chúng tôi sẽ phản hồi trong vòng 7 ngày làm việc.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">8. Cookie và công nghệ theo dõi</h2>
            <p>
              Nền tảng sử dụng cookie kỹ thuật để duy trì phiên đăng nhập và cookie phân tích từ Google Analytics để hiểu cách người dùng tương tác với dịch vụ. Bạn có thể tắt cookie trong trình duyệt, tuy nhiên điều này có thể ảnh hưởng đến một số tính năng của Nền tảng.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">9. Trẻ em</h2>
            <p>
              Nền tảng không dành cho người dưới 18 tuổi. Chúng tôi không cố ý thu thập thông tin từ trẻ em. Nếu phát hiện tài khoản thuộc về người dưới 18 tuổi, chúng tôi sẽ xóa tài khoản và dữ liệu liên quan ngay lập tức.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">10. Thay đổi chính sách</h2>
            <p>
              Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian. Mọi thay đổi quan trọng sẽ được thông báo qua email và/hoặc hiển thị thông báo nổi bật trên Nền tảng ít nhất 7 ngày trước khi có hiệu lực. Phiên bản luôn được cập nhật tại <strong>ueb.quanganh.org/privacy</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">11. Liên hệ</h2>
            <p>Mọi thắc mắc, khiếu nại về Chính sách bảo mật, vui lòng liên hệ:</p>
            <ul className="list-none pl-0 space-y-1">
              <li><strong>Email:</strong> <a href="mailto:support@ueb.quanganh.org" className="text-blue-600 hover:underline">support@ueb.quanganh.org</a></li>
              <li><strong>Địa chỉ:</strong> Trường Đại học Kinh tế — Đại học Quốc gia Hà Nội, 144 Xuân Thủy, Cầu Giấy, Hà Nội</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
