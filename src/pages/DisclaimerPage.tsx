export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <a href="/login" className="text-sm text-blue-600 hover:underline">← Quay lại đăng nhập</a>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-6 mb-2">Điều khoản sử dụng</h1>
          <p className="text-slate-500 text-sm">Cập nhật lần cuối: 25 tháng 3, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 dark:text-slate-300">

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">1. Chấp thuận điều khoản</h2>
            <p>
              Bằng việc truy cập và sử dụng nền tảng UEB Trading Platform ("Nền tảng"), bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi toàn bộ các điều khoản và điều kiện được nêu trong tài liệu này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, bạn không được phép sử dụng Nền tảng.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">2. Phạm vi dịch vụ</h2>
            <p>
              UEB Trading Platform là một nền tảng giao dịch nội bộ dành riêng cho sinh viên, giảng viên và cán bộ thuộc hệ thống Đại học Quốc gia Hà Nội (ĐHQGHN). Nền tảng cung cấp môi trường để người dùng đăng tin mua bán, trao đổi hàng hóa và dịch vụ trong phạm vi cộng đồng đại học.
            </p>
            <p>
              Nền tảng <strong>không phải</strong> là sàn giao dịch tài chính, không cung cấp dịch vụ môi giới chứng khoán, không xử lý thanh toán và không có tư cách pháp lý của một tổ chức tài chính được cấp phép.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">3. Điều kiện sử dụng</h2>
            <p>Để sử dụng Nền tảng, bạn phải đáp ứng đồng thời các điều kiện sau:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sở hữu tài khoản email hợp lệ thuộc tên miền <strong>@vnu.edu.vn</strong> do ĐHQGHN cấp phát.</li>
              <li>Là thành viên hiện tại của cộng đồng ĐHQGHN (sinh viên đang học, giảng viên, hoặc cán bộ).</li>
              <li>Đủ 18 tuổi trở lên, hoặc có sự đồng ý của người giám hộ hợp pháp.</li>
              <li>Có đầy đủ năng lực hành vi dân sự theo quy định của pháp luật Việt Nam.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">4. Quy tắc ứng xử của người dùng</h2>
            <p>Khi sử dụng Nền tảng, người dùng cam kết:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chỉ đăng tin về hàng hóa và dịch vụ hợp pháp theo quy định của pháp luật Việt Nam.</li>
              <li>Cung cấp thông tin trung thực, chính xác về hàng hóa, giá cả và điều kiện giao dịch.</li>
              <li>Không đăng tin về vũ khí, chất kích thích, hàng giả, hàng nhái hoặc bất kỳ mặt hàng bị cấm nào.</li>
              <li>Không sử dụng Nền tảng để lừa đảo, quấy rối hoặc gây hại cho người dùng khác.</li>
              <li>Không can thiệp vào hệ thống kỹ thuật, cố tình gây lỗi hoặc khai thác lỗ hổng bảo mật.</li>
              <li>Tôn trọng quyền riêng tư và thông tin cá nhân của người dùng khác.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">5. Giới hạn trách nhiệm</h2>
            <p>
              UEB Trading Platform đóng vai trò là trung gian kết nối người mua và người bán. Nền tảng <strong>không chịu trách nhiệm</strong> về:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Chất lượng, tình trạng thực tế của hàng hóa hoặc dịch vụ được đăng trên Nền tảng.</li>
              <li>Kết quả của các giao dịch được thỏa thuận giữa người dùng với nhau.</li>
              <li>Thiệt hại phát sinh từ tranh chấp giữa các bên tham gia giao dịch.</li>
              <li>Việc người dùng vi phạm quy định pháp luật trong quá trình giao dịch.</li>
              <li>Mất mát dữ liệu do sự cố kỹ thuật ngoài tầm kiểm soát của Nền tảng.</li>
            </ul>
            <p>
              Mọi giao dịch được thực hiện hoàn toàn dựa trên sự tự nguyện và thỏa thuận trực tiếp giữa các bên. Nền tảng khuyến khích người dùng kiểm tra kỹ thông tin và gặp mặt trực tiếp tại địa điểm công cộng, an toàn khi thực hiện trao đổi.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">6. Quyền sở hữu trí tuệ</h2>
            <p>
              Toàn bộ nội dung, giao diện, mã nguồn, logo và tên thương hiệu của UEB Trading Platform là tài sản của nhóm phát triển và được bảo hộ theo quy định về sở hữu trí tuệ. Người dùng không được sao chép, phân phối hoặc sử dụng thương mại bất kỳ phần nào của Nền tảng khi chưa được cấp phép bằng văn bản.
            </p>
            <p>
              Nội dung do người dùng đăng tải (hình ảnh, mô tả, thông tin sản phẩm) vẫn thuộc quyền sở hữu của người đăng. Bằng cách đăng tải, người dùng cấp cho Nền tảng quyền hiển thị nội dung đó cho mục đích vận hành dịch vụ.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">7. Chấm dứt tài khoản</h2>
            <p>
              Nền tảng có quyền tạm khóa hoặc chấm dứt tài khoản của người dùng mà không cần thông báo trước trong các trường hợp: vi phạm điều khoản sử dụng, có hành vi gian lận, hoặc khi tài khoản email @vnu.edu.vn không còn hợp lệ. Người dùng có thể tự xóa tài khoản bất kỳ lúc nào bằng cách liên hệ với đội ngũ hỗ trợ.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">8. Thay đổi điều khoản</h2>
            <p>
              Chúng tôi có quyền cập nhật các điều khoản này bất kỳ lúc nào. Khi có thay đổi quan trọng, người dùng sẽ được thông báo qua email hoặc thông báo trên Nền tảng. Việc tiếp tục sử dụng Nền tảng sau khi thay đổi có hiệu lực được coi là chấp thuận các điều khoản mới.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">9. Luật áp dụng</h2>
            <p>
              Các điều khoản này được điều chỉnh bởi pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết tại Tòa án nhân dân có thẩm quyền tại Hà Nội.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">10. Liên hệ</h2>
            <p>
              Nếu bạn có câu hỏi về Điều khoản sử dụng, vui lòng liên hệ qua email:&nbsp;
              <a href="mailto:support@ueb.quanganh.org" className="text-blue-600 hover:underline">support@ueb.quanganh.org</a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
