import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {EditorControls, EditorControlTypes, MarkDownModel} from '../mark-down.interfaces';

interface EditorControl {
  type: EditorControls;
  class: string;
  pattern: string;
}

@Directive({
  selector: '[ccMarkDown]'
})
export class CcMarkDownDirective implements OnInit, OnChanges {

  @Input('value') defaultValue: string;
  @Output() valueChange = new EventEmitter<MarkDownModel>();

  @HostBinding('value') value: string;

  private linkRegex: RegExp = /\[\[([\w\s.:/]+)[|]*([\w\s]*)\]\]/gm;
  private boldRegex: RegExp = /\*\*([\w\s]+)\*\*/gm;
  private italicsRegex: RegExp = /\/\/([\w\s]+)\/\//gm;
  private underlineRegex: RegExp = /__([\w\s]+)__/gm;
  private newLineRegex: RegExp = /\n/gm;

  private editorControls = [
    {
      type: EditorControlTypes.BOLD,
      class: 'cc-bold-btn',
      pattern: '**{content}**'
    },
    {
      type: EditorControlTypes.ITALICS,
      class: 'cc-italics-btn',
      pattern: '//{content}//'
    },
    {
      type: EditorControlTypes.UNDERLINE,
      class: 'cc-underline-btn',
      pattern: '__{content}__'
    },
    {
      type: EditorControlTypes.LINK,
      class: 'cc-link-btn',
      pattern: '[[{content}]]'
    }
  ];

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    const controlsContainer = this.renderer.createElement('div');
    this.renderer.addClass(controlsContainer, 'cc-editor-ctrls-container');
    this.renderer.setStyle(controlsContainer, 'width', this.el.nativeElement.clientWidth + 'px');
    this.instantiateEditorControls(controlsContainer);
    this.renderer.setAttribute(this.el.nativeElement, 'placeholder', 'Type something!');
    this.renderer.insertBefore(this.el.nativeElement.parentNode, controlsContainer, this.el.nativeElement.nextElementSibling);
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.defaultValue.currentValue !== changes.defaultValue.previousValue) {

      const markDown = changes.defaultValue.currentValue;
      const html = this.getHtmlMarker(markDown);
      this.value = markDown;

      this.valueChange.emit({markDown, html});
    }
  }

  instantiateEditorControls(container: HTMLElement) {
    this.editorControls.forEach(control => {
      const ctrlEl = this.renderer.createElement('button');
      this.renderer.addClass(ctrlEl, control.class);
      this.renderer.listen(ctrlEl, 'click', () => {
        this.styleText(control);
      });
      this.renderer.appendChild(container, ctrlEl);
    });
  }

  styleText(control: EditorControl) {
    let start = this.el.nativeElement.selectionStart;
    let end = this.el.nativeElement.selectionEnd;

    if (start === end) {
      return;
    }

    if (start > end) {
      start = end;
      end = this.el.nativeElement.selectionStart;
    }
    const selection = this.value.substring(start, end);
    const selectedMarkup = control.pattern.replace('{content}', selection);
    const markDown = this.value.substr(0, start) + selectedMarkup + this.value.substr(end);

    this.value = markDown;
    const html = this.getHtmlMarker(markDown);
    this.valueChange.emit({markDown, html});
  }

  getHtmlMarker(valueText: string): string {
    let html = valueText;

    html = html.replace(this.newLineRegex, '<br/>');
    html = html.replace(this.boldRegex, '<strong>$1</strong>');
    html = html.replace(this.italicsRegex, '<em>$1</em>');
    html = html.replace(this.underlineRegex, '<span class="cc-underline">$1</span>');
    html = html.replace(this.linkRegex, (pattern, m1, m2) => {
      return `<a href="${m1.trim()}" target="_new">${(m2 || m1).trim()}</a>`;
    });

    return `<p>${html}</p>`;
  }

  @HostListener('keyup', ['$event']) onKeyEnter(event: KeyboardEvent) {
    this.value = event.currentTarget['value'];
    const html = this.getHtmlMarker(this.value);
    this.valueChange.emit({markDown: this.value, html});
  }

}
