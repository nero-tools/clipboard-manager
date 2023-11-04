import { appWindow } from "@tauri-apps/api/window";
import { Component } from "preact";
import { ClipboardUtil } from "../utils/clipboard-util";

interface Props {
  data: string;
}

class ClipboardEntry extends Component<Props> {
  renderImageEntry() {
    return (
      <div
        class="h-20 p-2 bg-[#282828] rounded-lg"
        onClick={(_) => {
          void ClipboardUtil.writeImage(this.props.data);
          void appWindow.hide();
        }}
      >
        <img src={this.props.data} class="h-16"></img>
      </div>
    );
  }

  renderTextEntry() {
    return (
      <div
        class="h-20 p-2 bg-[#282828] rounded-lg overflow-hidden"
        onClick={(_) => {
          void ClipboardUtil.writeText(this.props.data);
          void appWindow.hide();
        }}
      >
        <p class="h-20 text-ellipsis">{this.props.data}</p>
      </div>
    );
  }

  render(props: Props) {
    if (props.data.startsWith("data:image")) {
      return this.renderImageEntry();
    }

    return this.renderTextEntry();
  }
}

export default ClipboardEntry;
