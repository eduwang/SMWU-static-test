document.getElementById("basicAlertBtn").addEventListener("click", () => {
    alert("이건 기본 alert입니다!");
  });
  
  document.getElementById("sweetAlertBtn").addEventListener("click", () => {
    Swal.fire({
      title: 'Hello!',
      text: '이건 SweetAlert2로 만든 팝업입니다.',
      icon: 'success',
      confirmButtonText: '닫기'
    });
  });
  