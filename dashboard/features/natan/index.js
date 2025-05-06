document.addEventListener("gridReadyEvent", (event) => {
    let myContainer = document.getElementById('balota-natan-widget');
    loadNatanWidget(myContainer);
});

function loadNatanWidget(container) {
    fetch('features/natan/widget.html')
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
            startNatanApp();
        });
}

function startNatanApp() {
    new Vue(
    {
        el: '#balota-natan-widget',
        data:
        {
            status: "",
            message: ""
        },
        methods:
        {
            getData: function ()
            {
                this.status = this.message;
                axios.get('http://localhost:3000/').then(response => (this.status = response.data.status));
            },
            sendData: function ()
            {
                axios.post('http://localhost:3000/auth',
                    { message: this.message }).then(response => (this.status = response.data.status));
            }
        }
    });
}