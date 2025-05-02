/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

      // Chama a função ao carregar a página
    listarVideos();

    const modal = document.getElementById('modal_video_podcast');
    const iframe = document.getElementById('modal_video_iframe');
    const modal_description = document.getElementById('modal_description');

    modal.addEventListener('show.bs.modal', function (event) {
        const triggerElement = event.relatedTarget;
        const videoUrl = triggerElement.getAttribute('data-video');
        const videoTitle = triggerElement.getAttribute('data-video-title');
        const videoPublished = triggerElement.getAttribute('data-video-published');
        const videoDescription = triggerElement.getAttribute('data-video-description');
        iframe.src = videoUrl;
        modal_description.innerHTML = `
            <div style="text-align:right" class="text-muted"><small>${videoPublished}</small></div>
            <h4>${videoTitle}</h4>            
            <p>${videoDescription}</p>
        `;
    });

    modal.addEventListener('hidden.bs.modal', function () {
        iframe.src = ''; // limpa o iframe ao fechar
        modal_description.innerHTML = '';
    });





    // VALIDAÇÂO DO FORMULARIO DE CONTATO
    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitButton");

    // Impede envio se o formulário for inválido
    form.addEventListener("submit", function (event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }

        form.classList.add("was-validated");
    });

    // Habilita botão só quando todos os campos forem válidos
    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            if (form.checkValidity()) {
                submitBtn.disabled = false;
            } else {
                submitBtn.disabled = true;
            }
        });
    });

    // Inicialmente desativa o botão
    submitBtn.disabled = true;

    // Define o redirecionamento dinâmico após o envio do formulário
    document.getElementById('form-next').value = window.location.origin + "escancarados/pages/contact-thanks.html";

});


function listarVideos() {
    const channelId = 'UCJc9tNFqYikE4M6Jqqgs0rw'; // Seu ID de canal
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  
    fetch(proxyUrl + encodeURIComponent(feedUrl))
      .then(response => response.json())
      .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, 'text/xml');
        const entries = Array.from(xml.getElementsByTagName('entry')).slice(0, 5);
        const container = document.getElementById('time_line_itens');
        
        let count = 0;
        
        for (let entry of entries) {
            
          const title = entry.getElementsByTagName('title')[0]?.textContent;
          const videoId = entry.getElementsByTagNameNS('http://www.youtube.com/xml/schemas/2015', 'videoId')[0]?.textContent;
          const published = entry.getElementsByTagName('published')[0]?.textContent;
          const description = entry.getElementsByTagName('media:description')[0]?.textContent;
          const thumbnail = entry.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url');
  
          if (!title || !videoId) continue;

            const videoHTML = `
                ${count == 1 ? '<li class="timeline-inverted">' : '<li>'}
                
                <div class="timeline-image portfolio-link"
                    data-bs-toggle="modal"
                    data-bs-target="#modal_video_podcast"

                    data-video="https://www.youtube.com/embed/${videoId}"
                    data-video-title="${title}"
                    data-video-published="${formatDateUTC(published)}"
                    data-video-description="${description? description : 'Sem descrição disponível'}"

                    style="cursor:pointer">
                    <img class="rounded-circle trumbs-podcast" src="${thumbnail}" alt="..." />
                </div>

                <div class="timeline-panel">
                    <div class="timeline-heading">
                        <h6>${formatDateUTC(published)}</h6>
                        <h4 class="subheading">${title}</h4>
                    </div>
                    <div class="timeline-body limit-5-lines"><p class="text-muted">${description? description : 'Sem descrição disponível'}</p></div>
                </div>
                </li>
            `;
    
            if (count==1) {
                count = 0;
            } else {
                count = 1; 
            }

            container.innerHTML += videoHTML;
            
        }

        container.innerHTML += `
        <li class="timeline-inverted">
            <div class="timeline-image ">
                <h4 class="mt-3 mt-sm-4 mt-md-5">                    
                    Mais<br/>
                  
                    <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/@escancarados" style="color:white;">Clique Aqui</a>
                 
                </h4>
            </div>
        </li> 
    `;
      })
      .catch(err => console.error('Erro ao buscar vídeos:', err));
  }
  
function formatDateUTC(data) {
    const date = new Date(data);
    return date.toLocaleString("en-US", {
        month: "short",     // "May"
        day: "numeric",     // "1"
        year: "numeric",    // "2025"
        hour: "numeric",    // "12"
        minute: "2-digit",  // "24"
        hour12: true,       // "PM"
        timeZone: "America/Sao_Paulo" // Ajuste para sua zona, se quiser horário local
    });
}
